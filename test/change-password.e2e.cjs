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
  const adminId = randomUUID();
  const lgaId = randomUUID();
  const wardId = randomUUID();
  const emails = ['admin-', 'supervisor-', 'field-'].map((prefix) => 'password-test-' + prefix + nonce + '@example.test');
  const assignedPassword = 'Assigned-' + randomUUID();
  const ownPasswords = ['PersonalSup-' + randomUUID(), 'PersonalAgent-' + randomUUID()];
  let passed = 0;

  async function request(route, body, token) {
    const response = await fetch(baseUrl + route, {
      method: body ? 'POST' : 'GET',
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

  console.log('Waiting for the backend to be ready...');
  const deadline = Date.now() + 240000;
  let ready = false;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl + '/auth/profile', { signal: AbortSignal.timeout(2000) });
      await response.text();
      if (response.status === 401) { ready = true; break; }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  assert.equal(ready, true, 'Backend did not become ready within four minutes');

  await db.connect();
  try {
    await db.query('INSERT INTO local_government_areas (id,name,code) VALUES ($1,$2,$3)', [lgaId, 'Password test ' + nonce, 'pw-' + nonce]);
    await db.query('INSERT INTO wards (id,"lgaId",name,code) VALUES ($1,$2,$3,$4)', [wardId, lgaId, 'Password test ward', 'pw-ward']);
    await db.query('INSERT INTO users (id,"firstName","lastName",email,username,password,role,"isActive") VALUES ($1,$2,$3,$4,$5,$6,$7,true)', [
      adminId, 'Password', 'Test', emails[0], 'pw-' + nonce, await bcrypt.hash(assignedPassword, 10), 'super_admin',
    ]);
    const adminLogin = await request('/auth/login', { email: emails[0], password: assignedPassword });
    assert.equal(adminLogin.status, 200);
    const registration = {
      firstName: 'Password', lastName: 'Test', phone: '+2348012345678',
      password: assignedPassword, confirmPassword: assignedPassword, state: 'Kano', lga: lgaId, ward: wardId,
    };
    const supervisor = await request('/agents/register', { ...registration, role: 'supervisor', email: emails[1] }, adminLogin.data.access_token);
    check(supervisor.status, 201, 'admin creates supervisor with an assigned password');
    const supervisorLogin = await request('/auth/login', { email: emails[1], password: assignedPassword });
    assert.equal(supervisorLogin.status, 200);
    const fieldAgent = await request('/agents/register', { ...registration, role: 'field_agent', email: emails[2] }, supervisorLogin.data.access_token);
    check(fieldAgent.status, 201, 'supervisor creates field agent with an assigned password');

    check((await request('/auth/change-password', { currentPassword: assignedPassword, newPassword: ownPasswords[0] })).status, 401, 'anonymous password changes are denied');

    for (let index = 0; index < 2; index++) {
      const role = index === 0 ? 'supervisor' : 'field agent';
      const email = emails[index + 1];
      const login = await request('/auth/login', { email, password: assignedPassword });
      assert.equal(login.status, 200);
      const token = login.data.access_token;

      const incorrect = await request('/auth/change-password', { currentPassword: 'IncorrectPass123!', newPassword: ownPasswords[index] }, token);
      check(incorrect.status, 400, role + ' can retry an incorrect current password without an authentication error');
      check((await request('/auth/profile', undefined, token)).status, 200, role + ' remains authenticated after a failed attempt');
      check((await request('/auth/change-password', { currentPassword: assignedPassword, newPassword: 'short12' }, token)).status, 400, role + ' cannot use a short new password');
      check((await request('/auth/change-password', { currentPassword: assignedPassword, newPassword: assignedPassword }, token)).status, 400, role + ' must choose a different password');
      check((await request('/auth/change-password', { currentPassword: assignedPassword, newPassword: ownPasswords[index], userId: adminId }, token)).status, 400, role + ' cannot target another account');
      check((await request('/auth/change-password', { currentPassword: assignedPassword, newPassword: ownPasswords[index] }, token)).status, 200, role + ' changes the assigned password');
      check((await request('/auth/login', { email, password: assignedPassword })).status, 401, role + ' old password no longer works');
      check((await request('/auth/login', { email, password: ownPasswords[index] })).status, 200, role + ' can sign in using their own password');
      const stored = await db.query('SELECT password FROM users WHERE email=$1', [email]);
      assert.notEqual(stored.rows[0].password, ownPasswords[index]);
      assert.equal(await bcrypt.compare(ownPasswords[index], stored.rows[0].password), true);
    }
    check((await request('/auth/login', { email: emails[0], password: assignedPassword })).status, 200, 'admin account credentials are unchanged');
    console.log(passed + ' live password-change checks passed.');
  } finally {
    const users = await db.query('SELECT id FROM users WHERE email = ANY($1::text[])', [emails]);
    if (users.rows.length) {
      const ids = users.rows.map((user) => user.id);
      const sessions = await db.query("SELECT to_regclass('public.session') AS name");
      if (sessions.rows[0].name) await db.query("DELETE FROM session WHERE sess->>'userId' = ANY($1::text[])", [ids]);
      await db.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [ids]);
    }
    await db.query('DELETE FROM local_government_areas WHERE id=$1', [lgaId]);
    await db.end();
    console.log('Removed password-test accounts, profiles, locations and sessions.');
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
