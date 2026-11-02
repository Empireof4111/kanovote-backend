const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ project: path.join(__dirname, '../tsconfig.json'), transpileOnly: true });
require('tsconfig-paths').register({ baseUrl: path.join(__dirname, '..'), paths: { '@/*': ['src/*'] } });
require('reflect-metadata');
const bcrypt = require('bcryptjs');
const { ForbiddenException, BadRequestException, ConflictException } = require('@nestjs/common');
const { Reflector } = require('@nestjs/core');
const { AgentService } = require('../src/modules/agents/agents.service');
const { AgentController } = require('../src/modules/agents/agents.controller');
const { RolesGuard } = require('../src/modules/auth/guards/roles.guard');

const supervisor = { id: 'supervisor-user', role: 'supervisor' };
const admin = { id: 'admin-user', role: 'super_admin' };
const registration = {
  firstName: 'New', lastName: 'Agent', email: 'new@example.com', phone: '+2348012345678',
  password: 'ExamplePass123!', confirmPassword: 'ExamplePass123!',
  role: 'field_agent', state: 'Kano', lga: 'assigned-lga', ward: 'assigned-ward',
};

function fixture(options = {}) {
  const writes = [];
  const profile = options.profile === undefined
    ? { userId: supervisor.id, role: 'supervisor', status: 'active', state: 'Kano', lga: 'assigned-lga' }
    : options.profile;
  const agents = {
    findOne: async ({ where }) => where.userId === supervisor.id && where.role === 'supervisor' ? profile : null,
    create: (data) => ({ ...data }),
    save: async (data) => { writes.push(['agent', data]); return { id: 'new-agent', ...data }; },
  };
  const users = {
    findOne: async () => options.existingUser || null,
    create: (data) => ({ ...data }),
    save: async (data) => { writes.push(['user', data]); return { id: 'new-user', ...data }; },
  };
  const wards = {
    findOne: async ({ where }) => options.wardMissing || where.id !== 'assigned-ward' || where.lgaId !== 'assigned-lga'
      ? null : { id: 'assigned-ward', lgaId: 'assigned-lga' },
  };
  return { service: new AgentService(agents, {}, users, wards), writes };
}

test('supervisor creates a new field agent in their LGA with a hashed login password', async () => {
  const { service, writes } = fixture();
  const result = await service.registerAgent({ ...registration }, supervisor);
  assert.equal(result.agent.role, 'field_agent');
  assert.equal(result.agent.lga, 'assigned-lga');
  assert.equal(result.agent.ward, 'assigned-ward');
  assert.equal(result.agent.userId, result.user.id);
  assert.equal(result.user.role, 'field_agent');
  assert.notEqual(result.user.password, registration.password);
  assert.equal(await bcrypt.compare(registration.password, result.user.password), true);
  assert.equal(writes.length, 2);
});

for (const role of ['supervisor', 'super_admin']) {
  test('supervisor cannot register role ' + role, async () => {
    const { service, writes } = fixture();
    await assert.rejects(service.registerAgent({ ...registration, role }, supervisor), ForbiddenException);
    assert.deepEqual(writes, []);
  });
}

for (const change of [{ lga: 'other-lga' }, { state: 'other-state' }]) {
  test('supervisor cannot register outside assignment: ' + JSON.stringify(change), async () => {
    const { service, writes } = fixture();
    await assert.rejects(service.registerAgent({ ...registration, ...change }, supervisor), ForbiddenException);
    assert.deepEqual(writes, []);
  });
}

test('supervisor cannot select another LGA ward or an unknown ward', async () => {
  const { service, writes } = fixture({ wardMissing: true });
  await assert.rejects(service.registerAgent({ ...registration, ward: 'other-ward' }, supervisor), BadRequestException);
  assert.deepEqual(writes, []);
});

for (const profile of [
  null,
  { role: 'supervisor', status: 'inactive', state: 'Kano', lga: 'assigned-lga' },
  { role: 'supervisor', status: 'suspended', state: 'Kano', lga: 'assigned-lga' },
  { role: 'supervisor', status: 'active', state: 'Kano', lga: '' },
]) {
  test('supervisor requires an active assigned profile: ' + JSON.stringify(profile), async () => {
    const { service, writes } = fixture({ profile });
    await assert.rejects(service.registerAgent({ ...registration }, supervisor), ForbiddenException);
    assert.deepEqual(writes, []);
  });
}

test('supervisor cannot change an existing user password or role, even without an agent profile', async () => {
  const existingUser = { id: 'existing', email: registration.email, password: 'original-hash', role: 'super_admin' };
  const before = { ...existingUser };
  const { service, writes } = fixture({ existingUser });
  await assert.rejects(service.registerAgent({ ...registration }, supervisor), ConflictException);
  assert.deepEqual(existingUser, before);
  assert.deepEqual(writes, []);
});

test('field agents cannot register accounts', async () => {
  const { service, writes } = fixture();
  await assert.rejects(service.registerAgent({ ...registration }, { id: 'field', role: 'field_agent' }), ForbiddenException);
  assert.deepEqual(writes, []);
});

test('super admin retains registration of supervisors outside any supervisor assignment', async () => {
  const { service } = fixture({ profile: null, wardMissing: true });
  const result = await service.registerAgent({ ...registration, role: 'supervisor', lga: 'other-lga' }, admin);
  assert.equal(result.agent.role, 'supervisor');
  assert.equal(result.agent.lga, 'other-lga');
  assert.equal(result.user.role, 'supervisor');
});

test('controller passes authenticated requester and omits the password hash', async () => {
  let received;
  const controller = new AgentController({
    registerAgent: async (...args) => {
      received = args;
      return { agent: { id: 'created' }, user: { id: 'user', password: 'hash' } };
    },
  });
  const result = await controller.registerAgent({ user: supervisor }, registration);
  assert.deepEqual(received, [registration, supervisor]);
  assert.equal(Object.hasOwn(result.user, 'password'), false);
});

test('route guard permits supervisor registration but keeps other creation restricted to admins', () => {
  const guard = new RolesGuard(new Reflector());
  const context = (handler, user) => ({
    getHandler: () => handler,
    getClass: () => AgentController,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  });
  assert.equal(guard.canActivate(context(AgentController.prototype.registerAgent, supervisor)), true);
  assert.equal(guard.canActivate(context(AgentController.prototype.registerAgent, admin)), true);
  assert.throws(() => guard.canActivate(context(AgentController.prototype.registerAgent, { role: 'field_agent' })), ForbiddenException);
  assert.throws(() => guard.canActivate(context(AgentController.prototype.create, supervisor)), ForbiddenException);
});
