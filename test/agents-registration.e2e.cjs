const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const db = new Client({
    host: process.env.DATABASE_HOST, port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER, password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
  const baseUrl = process.env.TEST_API_URL || 'http://127.0.0.1:3000';
  const nonce = randomUUID();
  const supervisorId = randomUUID();
  const lgaId = randomUUID();
  const otherLgaId = randomUUID();
  const wardId = randomUUID();
  const otherWardId = randomUUID();
  const supervisorEmail = 'supervisor-' + nonce + '@example.test';
  const fieldEmail = 'field-' + nonce + '@example.test';
  const testPassword = 'TestOnly-' + randomUUID();
  let passed = 0;

  async function request(route, method = 'GET', body, token) {
    const response = await fetch(baseUrl + route, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(15000),
    });
    return { status: response.status, data: await response.json() };
  }
  function check(actual, expected, label) {
    assert.equal(actual, expected, label);
    console.log('PASS: ' + label);
    passed++;
  }

  await db.connect();
  try {
    await db.query('INSERT INTO local_government_areas (id, name, code) VALUES ($1,$2,$3),($4,$5,$6)', [
      lgaId, 'Registration test LGA ' + nonce, 'test-' + nonce,
      otherLgaId, 'Registration test outside LGA ' + nonce, 'other-' + nonce,
    ]);
    await db.query('INSERT INTO wards (id, "lgaId", name, code) VALUES ($1,$2,$3,$4),($5,$6,$7,$8)', [
      wardId, lgaId, 'Registration test ward', 'test-ward',
      otherWardId, otherLgaId, 'Outside test ward', 'other-ward',
    ]);
    await db.query('INSERT INTO users (id,"firstName","lastName",email,username,password,role,phone,"isActive") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)', [
      supervisorId, 'Registration', 'Test', supervisorEmail, 'test-' + nonce,
      await bcrypt.hash(testPassword, 10), 'supervisor', '+2348012345678',
    ]);
    await db.query('INSERT INTO agents (id,"userId",role,state,lga,ward,status) VALUES ($1,$2,$3,$4,$5,$6,$7)', [
      randomUUID(), supervisorId, 'supervisor', 'Kano', lgaId, wardId, 'active',
    ]);

    const login = await request('/auth/login', 'POST', { email: supervisorEmail, password: testPassword });
    check(login.status, 200, 'supervisor login');
    const token = login.data.access_token;
    const body = {
      firstName: 'Field', lastName: 'Test', email: fieldEmail, phone: '+2348012345678',
      password: testPassword, confirmPassword: testPassword, role: 'field_agent', state: 'Kano', lga: lgaId, ward: wardId,
    };
    check((await request('/agents/register', 'POST', body)).status, 401, 'anonymous registration is denied');
    for (const role of ['super_admin', 'supervisor']) {
      check((await request('/agents/register', 'POST', { ...body, role }, token)).status, 403, 'supervisor cannot create ' + role);
    }
    check((await request('/agents/register', 'POST', { ...body, lga: otherLgaId }, token)).status, 403, 'another LGA is denied');
    check((await request('/agents/register', 'POST', { ...body, ward: otherWardId }, token)).status, 400, 'another LGA ward is denied');
    check((await request('/agents/register', 'POST', { ...body, email: supervisorEmail }, token)).status, 409, 'existing account is protected');

    const created = await request('/agents/register', 'POST', body, token);
    check(created.status, 201, 'supervisor creates field agent');
    assert.equal(created.data.agent.lga, lgaId);
    assert.equal(created.data.agent.ward, wardId);
    assert.equal(created.data.user.role, 'field_agent');
    assert.equal(Object.hasOwn(created.data.user, 'password'), false);

    const fieldLogin = await request('/auth/login', 'POST', { email: fieldEmail, password: testPassword });
    check(fieldLogin.status, 200, 'new field agent can log in');
    check((await request('/agents/register', 'POST', body, fieldLogin.data.access_token)).status, 403, 'field agent cannot register accounts');

    const list = await request('/agents?take=50', 'GET', undefined, token);
    check(list.status, 200, 'supervisor can reload field-agent list');
    assert.equal(list.data.total, 1);
    assert.equal(list.data.agents[0].id, created.data.agent.id);
    console.log(passed + ' live API checks passed.');
  } finally {
    const users = await db.query('SELECT id FROM users WHERE email = ANY($1::text[])', [[supervisorEmail, fieldEmail]]);
    if (users.rows.length) {
      const sessionTable = await db.query("SELECT to_regclass('public.session') AS name");
      if (sessionTable.rows[0].name) {
        await db.query("DELETE FROM session WHERE sess->>'userId' = ANY($1::text[])", [users.rows.map((user) => user.id)]);
      }
      await db.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [users.rows.map((user) => user.id)]);
    }
    await db.query('DELETE FROM local_government_areas WHERE id = ANY($1::uuid[])', [[lgaId, otherLgaId]]);
    await db.end();
    console.log('Removed test accounts, sessions, and locations.');
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
