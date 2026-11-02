const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ project: path.join(__dirname, '../tsconfig.json'), transpileOnly: true });
require('tsconfig-paths').register({ baseUrl: path.join(__dirname, '..'), paths: { '@/*': ['src/*'] } });
require('reflect-metadata');
const bcrypt = require('bcryptjs');
const { BadRequestException, UnauthorizedException } = require('@nestjs/common');
const { validate } = require('class-validator');
const { AuthService } = require('../src/modules/auth/auth.service');
const { AuthController } = require('../src/modules/auth/auth.controller');
const { ChangePasswordDto } = require('../src/modules/auth/dto');

async function fixture(missing = false) {
  const writes = [];
  const users = {
    findById: async () => missing ? null : { id: 'own-user', password: await bcrypt.hash('AssignedPass123!', 10) },
    updatePassword: async (userId, hash) => writes.push({ userId, hash }),
  };
  return { service: new AuthService(users, {}, {}), writes };
}

test('changing a password stores a hash for the authenticated account', async () => {
  const { service, writes } = await fixture();
  const result = await service.changePassword('own-user', { currentPassword: 'AssignedPass123!', newPassword: 'MyOwnPass456!' });
  assert.deepEqual(result, { message: 'Password updated successfully' });
  assert.equal(writes.length, 1);
  assert.equal(writes[0].userId, 'own-user');
  assert.notEqual(writes[0].hash, 'MyOwnPass456!');
  assert.equal(await bcrypt.compare('MyOwnPass456!', writes[0].hash), true);
  assert.equal(await bcrypt.compare('AssignedPass123!', writes[0].hash), false);
});

test('incorrect current password is a retryable error and never updates credentials', async () => {
  const { service, writes } = await fixture();
  await assert.rejects(
    service.changePassword('own-user', { currentPassword: 'IncorrectPass!', newPassword: 'MyOwnPass456!' }),
    (error) => error instanceof BadRequestException && error.getStatus() === 400,
  );
  assert.deepEqual(writes, []);
});

test('a missing account cannot change a password', async () => {
  const { service, writes } = await fixture(true);
  await assert.rejects(service.changePassword('missing', { currentPassword: 'AssignedPass123!', newPassword: 'MyOwnPass456!' }), UnauthorizedException);
  assert.deepEqual(writes, []);
});

test('the new password must differ from the current password', async () => {
  const { service, writes } = await fixture();
  await assert.rejects(service.changePassword('own-user', { currentPassword: 'AssignedPass123!', newPassword: 'AssignedPass123!' }), BadRequestException);
  assert.deepEqual(writes, []);
});

test('new-password validation requires at least eight characters', async () => {
  const short = Object.assign(new ChangePasswordDto(), { currentPassword: 'AssignedPass123!', newPassword: 'short12' });
  assert.equal((await validate(short)).some((error) => error.property === 'newPassword'), true);
  const valid = Object.assign(new ChangePasswordDto(), { currentPassword: 'AssignedPass123!', newPassword: 'MyOwnPass456!' });
  assert.deepEqual(await validate(valid), []);
});

test('password changes always use the authenticated user ID', async () => {
  let received;
  const controller = new AuthController({
    changePassword: async (...args) => { received = args; return { message: 'updated' }; },
  });
  const body = { userId: 'someone-else', currentPassword: 'AssignedPass123!', newPassword: 'MyOwnPass456!' };
  await controller.changePassword({ user: { id: 'own-user', role: 'field_agent' } }, body);
  assert.equal(received[0], 'own-user');
});
