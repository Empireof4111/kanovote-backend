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
  const userIds = [randomUUID(), randomUUID(), randomUUID()];
  const supporterIds = [];
  const testPassword = 'TestOnly-' + randomUUID();
  let passed = 0;
  async function request(route, token, body) {
    const response = await fetch(baseUrl + route, {
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(15000),
    });
    return { status: response.status, data: await response.json() };
  }
  function checkDashboard(response, expected, label) {
    assert.equal(response.status, 200);
    // Field agents receive only their own counters, without campaign analytics.
    assert.deepEqual(response.data, { supporters: expected });
    assert.equal(expected.total, expected.verified + expected.rejected + expected.pending);
    console.log('PASS: ' + label);
    passed++;
  }

  // Wait for the dev container to finish compiling before creating fixtures.
  console.log("Waiting for the backend to be ready...");
  const startupDeadline = Date.now() + 240000;
  let ready = false;
  while (Date.now() < startupDeadline) {
    try {
      const response = await fetch(baseUrl + "/auth/profile", { signal: AbortSignal.timeout(2000) });
      await response.text();
      if (response.status === 401) { ready = true; break; }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  assert.equal(ready, true, "Backend did not become ready within four minutes");

  await db.connect();
  try {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const tokens = [];
    for (let index = 0; index < userIds.length; index++) {
      const email = 'dashboard-' + index + '-' + nonce + '@example.test';
      await db.query('INSERT INTO users (id,"firstName","lastName",email,username,password,role,"isActive") VALUES ($1,$2,$3,$4,$5,$6,$7,true)', [
        userIds[index], 'Dashboard', 'Test', email, 'dash-' + index + '-' + nonce, hashedPassword, 'field_agent',
      ]);
      const login = await request('/auth/login', undefined, { email, password: testPassword });
      assert.equal(login.status, 200);
      tokens.push(login.data.access_token);
    }

    const statuses = [
      ['verified', 'verified', 'rejected', 'pending', 'pending'],
      ['verified', 'rejected', 'rejected', 'pending'],
    ];
    const pendingIds = [];
    for (let owner = 0; owner < statuses.length; owner++) {
      for (const status of statuses[owner]) {
        const id = randomUUID();
        supporterIds.push(id);
        if (owner === 0 && status === 'pending') pendingIds.push(id);
        const phone = '+' + BigInt('0x' + randomUUID().replace(/-/g, '').slice(0, 12)).toString().padStart(14, '0');
        await db.query('INSERT INTO supporters (id,"firstName","lastName",phone,"dateOfBirth",gender,occupation,state,lga,ward,"pollingUnit",address,"voterCardNumber",status,"registeredByUserId") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)', [
          id, 'Member', 'Test', phone, '2000-01-01', 'male', 'Test', 'Kano',
          'same-test-lga-' + nonce, 'same-test-ward', 'test-unit', 'Test address', 'test-' + id, status, userIds[owner],
        ]);
      }
    }

    const anonymous = await request('/admin/dashboard');
    assert.equal(anonymous.status, 401);
    console.log('PASS: dashboard requires authentication');
    passed++;
    const ownCounts = { total: 5, verified: 2, rejected: 1, pending: 2 };
    checkDashboard(await request('/admin/dashboard', tokens[0]), ownCounts, 'first agent sees only their five members');
    checkDashboard(await request('/admin/dashboard', tokens[1]), { total: 4, verified: 1, rejected: 2, pending: 1 }, 'second agent has separate totals within the same LGA');
    checkDashboard(await request('/admin/dashboard', tokens[2]), { total: 0, verified: 0, rejected: 0, pending: 0 }, 'new agent sees four zero counts');
    checkDashboard(await request('/admin/dashboard?userId=' + userIds[1], tokens[0]), ownCounts, 'query parameters cannot expose another agent totals');

    await db.query('UPDATE supporters SET status=$1 WHERE id=$2', ['verified', pendingIds[0]]);
    checkDashboard(await request('/admin/dashboard', tokens[0]), { total: 5, verified: 3, rejected: 1, pending: 1 }, 'verification moves a member out of pending');
    await db.query('UPDATE supporters SET status=$1 WHERE id=$2', ['rejected', pendingIds[1]]);
    checkDashboard(await request('/admin/dashboard', tokens[0]), { total: 5, verified: 3, rejected: 2, pending: 0 }, 'rejection moves a member out of pending');
    console.log(passed + ' live field-agent dashboard checks passed.');
  } finally {
    await db.query('DELETE FROM supporters WHERE id = ANY($1::uuid[])', [supporterIds]);
    const sessionTable = await db.query("SELECT to_regclass('public.session') AS name");
    if (sessionTable.rows[0].name) {
      await db.query("DELETE FROM session WHERE sess->>'userId' = ANY($1::text[])", [userIds]);
    }
    await db.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [userIds]);
    await db.end();
    console.log('Removed dashboard test accounts, members, and sessions.');
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
