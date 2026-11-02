const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ project: path.join(__dirname, '../tsconfig.json'), transpileOnly: true });
require('tsconfig-paths').register({ baseUrl: path.join(__dirname, '..'), paths: { '@/*': ['src/*'] } });
require('reflect-metadata');
const { AdminService } = require('../src/modules/admin/admin.service');
const { AdminController } = require('../src/modules/admin/admin.controller');

function fixture(rows) {
  const supporters = {
    count: async ({ where }) => rows.filter((row) => Object.entries(where).every(([key, value]) => row[key] === value)).length,
  };
  // Any attempt to fetch campaign analytics/global counts fails this test.
  const unavailable = new Proxy({}, { get: () => { throw new Error('Field agents must not load campaign-wide data'); } });
  return new AdminService(unavailable, unavailable, unavailable, unavailable, unavailable, supporters, unavailable);
}

test('field-agent dashboard counts only their own members in each review status', async () => {
  const service = fixture([
    { registeredByUserId: 'agent-a', status: 'verified' },
    { registeredByUserId: 'agent-a', status: 'verified' },
    { registeredByUserId: 'agent-a', status: 'rejected' },
    { registeredByUserId: 'agent-a', status: 'pending' },
    { registeredByUserId: 'agent-b', status: 'pending' },
    { registeredByUserId: 'agent-b', status: 'rejected' },
    { registeredByUserId: 'agent-b', status: 'verified' },
  ]);
  assert.deepEqual(await service.getDashboardStats({ id: 'agent-a', role: 'field_agent' }), {
    supporters: { total: 4, verified: 2, rejected: 1, pending: 1 },
  });
});

test('field agents with no members see zero for all four counters', async () => {
  const service = fixture([{ registeredByUserId: 'other-agent', status: 'verified' }]);
  assert.deepEqual(await service.getDashboardStats({ id: 'new-agent', role: 'field_agent' }), {
    supporters: { total: 0, verified: 0, rejected: 0, pending: 0 },
  });
});

test('current verification and rejection decisions move members out of pending', async () => {
  const row = { registeredByUserId: 'agent-a', status: 'pending' };
  const service = fixture([row]);
  const agent = { id: 'agent-a', role: 'field_agent' };
  assert.deepEqual((await service.getDashboardStats(agent)).supporters, { total: 1, verified: 0, rejected: 0, pending: 1 });
  row.status = 'verified';
  assert.deepEqual((await service.getDashboardStats(agent)).supporters, { total: 1, verified: 1, rejected: 0, pending: 0 });
  row.status = 'rejected';
  assert.deepEqual((await service.getDashboardStats(agent)).supporters, { total: 1, verified: 0, rejected: 1, pending: 0 });
});

test('dashboard uses the authenticated account even when another user ID is supplied in the query', async () => {
  let received;
  const controller = new AdminController({
    getDashboardStats: async (requester) => { received = requester; return { supporters: {} }; },
  });
  const user = { id: 'authenticated-agent', role: 'field_agent' };
  await controller.getDashboard({ user, query: { userId: 'another-agent' } });
  assert.deepEqual(received, user);
});
