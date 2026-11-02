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
  const roles = ['supervisor', 'supervisor', 'supervisor', 'supervisor', 'field_agent', 'field_agent', 'field_agent', 'super_admin', 'supervisor'];
  const userIds = roles.map(() => randomUUID());
  const supporterIds = [];
  const memberIds = new Map();
  const ownLga = 'supervisor-test-' + nonce;
  const otherLga = 'other-test-' + nonce;
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
  function check(response, counts, label) {
    assert.equal(response.status, 200);
    assert.deepEqual(response.data, { supporters: counts });
    assert.equal(counts.total, counts.verified + counts.rejected + counts.pending);
    console.log('PASS: ' + label);
    passed++;
  }

  console.log('Waiting for the backend to be ready...');
  const startupDeadline = Date.now() + 240000;
  let ready = false;
  while (Date.now() < startupDeadline) {
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
    const hash = await bcrypt.hash(testPassword, 10);
    for (let index = 0; index < userIds.length; index++) {
      await db.query('INSERT INTO users (id,"firstName","lastName",email,username,password,role,"isActive") VALUES ($1,$2,$3,$4,$5,$6,$7,true)', [
        userIds[index], 'Supervisor dashboard', 'Test', 'sup-dash-' + index + '-' + nonce + '@example.test',
        'sup-dash-' + index + '-' + nonce, hash, roles[index],
      ]);
      // Index 2 deliberately has no profile; index 3 has no assigned LGA.
      if (index !== 2) {
        const lga = index === 3 ? '' : index === 8 ? 'empty-team-' + nonce : [1, 6].includes(index) ? otherLga : ownLga;
        await db.query('INSERT INTO agents (id,"userId",role,state,lga,ward,status) VALUES ($1,$2,$3,$4,$5,$6,$7)', [
          randomUUID(), userIds[index], roles[index], 'Kano', lga, 'test-ward', 'active',
        ]);
      }
    }

    const statusesByUser = {
      0: ['verified', 'pending'],
      4: ['verified', 'verified', 'pending'],
      5: ['rejected', 'pending'],
      6: ['verified', 'rejected', 'pending'],
      7: ['pending'],
    };
    for (const [owner, statuses] of Object.entries(statusesByUser)) {
      const ids = [];
      for (const status of statuses) {
        const id = randomUUID();
        ids.push(id);
        supporterIds.push(id);
        const phone = '+' + BigInt('0x' + randomUUID().replace(/-/g, '').slice(0, 12)).toString().padStart(14, '0');
        // Give every member the same LGA to prove scope follows their field agent's assignment.
        await db.query('INSERT INTO supporters (id,"firstName","lastName",phone,"dateOfBirth",gender,occupation,state,lga,ward,"pollingUnit",address,"voterCardNumber",status,"registeredByUserId") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)', [
          id, 'Member', 'Test', phone, '2000-01-01', 'male', 'Test', 'Kano', ownLga,
          'test-ward', 'test-unit', 'Test address', 'test-' + id, status, userIds[Number(owner)],
        ]);
      }
      memberIds.set(Number(owner), ids);
    }

    const tokens = new Map();
    for (const index of [0, 1, 2, 3, 4, 8]) {
      const login = await request('/auth/login', undefined, {
        email: 'sup-dash-' + index + '-' + nonce + '@example.test', password: testPassword,
      });
      assert.equal(login.status, 200);
      tokens.set(index, login.data.access_token);
    }

    assert.equal((await request('/admin/dashboard')).status, 401);
    console.log('PASS: dashboard requires authentication');
    passed++;
    const ownCounts = { total: 5, verified: 2, rejected: 1, pending: 2 };
    const zeros = { total: 0, verified: 0, rejected: 0, pending: 0 };
    check(await request('/admin/dashboard', tokens.get(0)), ownCounts, 'supervisor totals combine assigned field agents and exclude supervisors, admins and other LGAs');
    check(await request('/admin/dashboard', tokens.get(1)), { total: 3, verified: 1, rejected: 1, pending: 1 }, 'another supervisor sees only their LGA field agents');
    check(await request('/admin/dashboard?userId=' + userIds[1] + '&lga=' + otherLga, tokens.get(0)), ownCounts, 'query parameters cannot switch the supervisor LGA');
    check(await request('/admin/dashboard', tokens.get(2)), zeros, 'missing supervisor profile returns zeros');
    check(await request('/admin/dashboard', tokens.get(3)), zeros, 'missing LGA assignment returns zeros');
    check(await request('/admin/dashboard', tokens.get(8)), zeros, 'empty LGA team returns zeros');
    check(await request('/admin/dashboard', tokens.get(4)), { total: 3, verified: 2, rejected: 0, pending: 1 }, 'field-agent dashboard remains personal');

    await db.query('UPDATE supporters SET status=$1 WHERE id=$2', ['verified', memberIds.get(5)[1]]);
    check(await request('/admin/dashboard', tokens.get(0)), { total: 5, verified: 3, rejected: 1, pending: 1 }, 'verification updates the supervisor subtotals');
    await db.query('UPDATE supporters SET status=$1 WHERE id=$2', ['rejected', memberIds.get(4)[2]]);
    check(await request('/admin/dashboard', tokens.get(0)), { total: 5, verified: 3, rejected: 2, pending: 0 }, 'rejection updates the supervisor subtotals');

    await db.query('UPDATE agents SET lga=$1 WHERE "userId"=$2', [otherLga, userIds[5]]);
    check(await request('/admin/dashboard', tokens.get(0)), { total: 3, verified: 2, rejected: 1, pending: 0 }, 'reassigned field agents leave the previous LGA totals');
    check(await request('/admin/dashboard', tokens.get(1)), { total: 5, verified: 2, rejected: 2, pending: 1 }, 'reassigned field agents appear in their current LGA totals');
    console.log(passed + ' live supervisor dashboard checks passed.');
  } finally {
    await db.query('DELETE FROM supporters WHERE id = ANY($1::uuid[])', [supporterIds]);
    const sessions = await db.query("SELECT to_regclass('public.session') AS name");
    if (sessions.rows[0].name) {
      await db.query("DELETE FROM session WHERE sess->>'userId' = ANY($1::text[])", [userIds]);
    }
    await db.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [userIds]);
    await db.end();
    console.log('Removed supervisor dashboard test accounts, members, profiles and sessions.');
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
