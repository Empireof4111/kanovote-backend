const assert = require('node:assert/strict');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { Writable } = require('node:stream');
require('ts-node').register({ project: path.join(__dirname, '../tsconfig.json'), transpileOnly: true });
require('tsconfig-paths').register({ baseUrl: path.join(__dirname, '..'), paths: { '@/*': ['src/*'] } });
require('reflect-metadata');
const { Test } = require('@nestjs/testing');
const { ValidationPipe, UnauthorizedException } = require('@nestjs/common');
const { TypeOrmModule } = require('@nestjs/typeorm');
const { DataSource } = require('typeorm');
const { v2: cloudinary } = require('cloudinary');
const { SupporterModule } = require('../src/modules/supporters/supporters.module');
const { JwtAuthGuard } = require('../src/modules/auth/guards/jwt-auth.guard');

// Real Nest multipart validation and PostgreSQL transactions; only external image
// storage and token verification are substituted. No real Cloudinary requests.
async function main() {
  const nonce = randomUUID();
  const userId = randomUUID();
  const agentId = randomUUID();
  const originalUpload = cloudinary.uploader.upload_stream;
  const originalDestroy = cloudinary.uploader.destroy;
  const originalCloud = Object.fromEntries(['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'MAX_FILE_SIZE'].map((key) => [key, process.env[key]]));
  Object.assign(process.env, { CLOUDINARY_CLOUD_NAME: 'test', CLOUDINARY_API_KEY: 'test', CLOUDINARY_API_SECRET: 'test', MAX_FILE_SIZE: '5242880' });
  let app;
  let db;
  let uploads = [];
  let deleted = [];
  let failAt = 0;
  let invalidStorageUrl = false;
  let passed = 0;

  cloudinary.uploader.upload_stream = (options, callback) => new Writable({
    write(chunk, encoding, done) { done(); },
    final(done) {
      uploads.push(options.public_id);
      if (uploads.length === failAt) callback(new Error('Simulated image upload failure'));
      else callback(null, { public_id: options.public_id, secure_url: invalidStorageUrl ? 'x'.repeat(501) : 'https://storage.example.test/' + uploads.length });
      done();
    },
  });
  cloudinary.uploader.destroy = async (publicId) => { deleted.push(publicId); return { result: 'ok' }; };

  try {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.TEST_DATABASE_HOST || process.env.DATABASE_HOST || '127.0.0.1',
          port: Number(process.env.TEST_DATABASE_PORT || process.env.DATABASE_PORT || 5432),
          username: process.env.TEST_DATABASE_USER || process.env.DATABASE_USER || 'postgres',
          password: process.env.TEST_DATABASE_PASSWORD || process.env.DATABASE_PASSWORD || 'postgres',
          database: process.env.TEST_DATABASE_NAME || process.env.DATABASE_NAME || 'kano_registration_db',
          entities: [path.join(__dirname, '../src/entities/*.entity.ts')],
          synchronize: false, dropSchema: false, logging: false, retryAttempts: 1,
        }),
        SupporterModule,
      ],
    }).overrideGuard(JwtAuthGuard).useValue({
      canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (!['Bearer agent-test-token', 'Bearer supervisor-test-token'].includes(request.headers.authorization)) throw new UnauthorizedException();
        request.user = { id: userId, role: request.headers.authorization === 'Bearer supervisor-test-token' ? 'supervisor' : 'field_agent' };
        return true;
      },
    }).compile();
    app = module.createNestApplication({ logger: false });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.listen(0, '127.0.0.1');
    db = module.get(DataSource);
    await db.query('INSERT INTO users (id,"firstName","lastName",email,username,password,role,"isActive") VALUES ($1,$2,$3,$4,$5,$6,$7,true)', [
      userId, 'Image registration', 'Test', nonce + '@example.test', nonce, 'not-a-login-hash', 'field_agent',
    ]);
    await db.query('INSERT INTO agents (id,"userId",role,state,lga,ward,status) VALUES ($1,$2,$3,$4,$5,$6,$7)', [
      agentId, userId, 'field_agent', 'Kano', 'test-lga', 'test-ward', 'active',
    ]);
    const baseUrl = await app.getUrl();
    const maxBytes = 5 * 1024 * 1024;
    const payload = {
      firstName: 'Image registration', lastName: 'Test', phone: '+2348031234567', dateOfBirth: '2000-01-01T00:00:00.000Z',
      gender: 'male', occupation: 'Test', state: 'Kano', lga: 'test-lga', ward: 'test-ward', pollingUnit: 'test-unit',
      address: 'Test', voterCardNumber: nonce,
    };
    // Pick a valid unused Nigerian-format phone without touching any existing member.
    for (let attempt = 0; attempt < 50; attempt++) {
      payload.phone = '+234803' + String(Math.floor(Math.random() * 10000000)).padStart(7, '0');
      if (!(await db.query('SELECT 1 FROM supporters WHERE phone=$1', [payload.phone])).length) break;
    }

    async function request(options = {}) {
      const form = new FormData();
      for (const [key, value] of Object.entries({ ...payload, ...options.body })) form.append(key, value);
      if (!options.omitPassport) form.append('passport', new Blob([Buffer.alloc(options.passportSize ?? 100)], { type: options.mime || 'image/jpeg' }), 'passport.jpg');
      if (!options.omitCard) form.append('voter_card', new Blob([Buffer.alloc(options.cardSize ?? 100)], { type: 'image/png' }), 'card.png');
      const response = await fetch(baseUrl + '/supporters/register-with-images', {
        method: 'POST', headers: { Authorization: options.token ?? 'Bearer agent-test-token' }, body: form,
        signal: AbortSignal.timeout(20000),
      });
      return { status: response.status, body: await response.json() };
    }
    function reset() { uploads = []; deleted = []; failAt = 0; invalidStorageUrl = false; }
    async function assertEmpty() {
      assert.equal((await db.query('SELECT id FROM supporters WHERE "registeredByUserId"=$1', [userId])).length, 0);
      assert.equal((await db.query('SELECT id FROM file_uploads WHERE "uploadedByUserId"=$1', [userId])).length, 0);
      assert.equal((await db.query('SELECT id FROM registrations WHERE "agentId"=$1', [agentId])).length, 0);
    }
    function pass(label) { passed++; console.log('PASS: ' + label); }
    async function clearMembers() { await db.query('DELETE FROM supporters WHERE "registeredByUserId"=$1', [userId]); }

    for (const options of [{ passportSize: maxBytes + 1 }, { cardSize: maxBytes + 1 }]) {
      reset();
      assert.equal((await request(options)).status, 413);
      await assertEmpty();
      assert.equal(uploads.length, 0);
      pass(options.passportSize ? 'oversized passport creates no member' : 'oversized voter card creates no member');
    }
    for (const [label, options] of [
      ['missing image', { omitCard: true }], ['empty image', { passportSize: 0 }],
      ['unsupported image type', { mime: 'image/heic' }], ['invalid form data', { body: { phone: 'invalid' } }],
    ]) {
      reset();
      assert.equal((await request(options)).status, 400);
      await assertEmpty();
      assert.equal(uploads.length, 0);
      pass(label + ' creates no member');
    }

    reset();
    assert.equal((await request({ token: 'Bearer supervisor-test-token' })).status, 403);
    assert.equal((await request({ token: '' })).status, 401);
    await assertEmpty();
    pass('role and authentication guards protect multipart registration');

    reset();
    await db.query('UPDATE agents SET status=$1 WHERE id=$2', ['inactive', agentId]);
    assert.equal((await request()).status, 403);
    await assertEmpty();
    assert.equal(uploads.length, 0);
    await db.query('UPDATE agents SET status=$1 WHERE id=$2', ['active', agentId]);
    pass('inactive agents cannot register members');

    for (const failedUpload of [1, 2]) {
      reset(); failAt = failedUpload;
      assert.equal((await request()).status, 400);
      await assertEmpty();
      assert.deepEqual(deleted, uploads.slice(0, failedUpload - 1));
      pass('upload ' + failedUpload + ' failure rolls back member and removes earlier images');
    }

    reset(); invalidStorageUrl = true;
    assert.equal((await request()).status, 500);
    await assertEmpty();
    assert.deepEqual(deleted, uploads);
    pass('database failure rolls back all rows and removes both stored images');

    reset();
    const success = await request();
    assert.equal(success.status, 201, JSON.stringify(success.body));
    assert.equal(success.body.documentUploaded, true);
    assert.equal(success.body.documentUrl, 'https://storage.example.test/1');
    assert.equal(success.body.registeredByUserId, userId);
    assert.equal(uploads.length, 2);
    const files = await db.query('SELECT "fileType" FROM file_uploads WHERE "supporterId"=$1', [success.body.id]);
    assert.deepEqual(files.map((file) => file.fileType).sort(), ['passport', 'voter_card']);
    const registrations = await db.query('SELECT * FROM registrations WHERE "supporterId"=$1', [success.body.id]);
    assert.equal(registrations.length, 1);
    assert.equal(registrations[0].agentId, agentId);
    assert.equal(registrations[0].status, 'completed');
    pass('retrying the same details after failed uploads creates one complete member');

    reset();
    assert.equal((await request()).status, 400);
    assert.equal(uploads.length, 0);
    assert.equal((await db.query('SELECT id FROM supporters WHERE "registeredByUserId"=$1', [userId])).length, 1);
    pass('completed members are protected against duplicate registration');
    await clearMembers();

    reset();
    const boundary = await request({ passportSize: maxBytes, cardSize: maxBytes });
    assert.equal(boundary.status, 201, JSON.stringify(boundary.body));
    assert.equal(uploads.length, 2);
    pass('images exactly 5 MB each are accepted');

    console.log(passed + ' multipart/transaction checks passed.');
  } finally {
    if (db?.isInitialized) {
      await db.query('DELETE FROM supporters WHERE "registeredByUserId"=$1', [userId]);
      await db.query('DELETE FROM agents WHERE id=$1 AND "userId"=$2', [agentId, userId]);
      await db.query('DELETE FROM users WHERE id=$1', [userId]);
    }
    await app?.close();
    cloudinary.uploader.upload_stream = originalUpload;
    cloudinary.uploader.destroy = originalDestroy;
    for (const [key, value] of Object.entries(originalCloud)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
