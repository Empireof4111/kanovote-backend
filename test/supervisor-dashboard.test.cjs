const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ project: path.join(__dirname, '../tsconfig.json'), transpileOnly: true });
require('tsconfig-paths').register({ baseUrl: path.join(__dirname, '..'), paths: { '@/*': ['src/*'] } });
require('reflect-metadata');
const { AdminService } = require('../src/modules/admin/admin.service');

const supervisor = { id: 'supervisor-user', role: 'supervisor' };
const zeroCounts = { total: 0, verified: 0, rejected: 0, pending: 0 };

function fixture(profile, groups = []) {
  const unavailable = new Proxy({}, { get: () => { throw new Error('Supervisor must not load campaign-wide data'); } });
  const query = {};
  for (const method of ['innerJoin', 'where', 'andWhere', 'select', 'addSelect', 'groupBy']) {
    query[method] = () => query;
  }
  query.getRawMany = async () => groups;
  const agents = {
    findOne: async ({ where }) => where.userId === supervisor.id && where.role === 'supervisor' ? profile : null,
  };
  const supporters = {
    createQueryBuilder: () => {
      if (!profile?.lga) throw new Error('Unassigned supervisors must not query member counts');
      return query;
    },
  };
  return new AdminService(unavailable, agents, unavailable, unavailable, unavailable, supporters, unavailable);
}

test('supervisor without a profile receives zero counts without accessing campaign data', async () => {
  assert.deepEqual(await fixture(null).getDashboardStats(supervisor), { supporters: zeroCounts });
});

test('supervisor without an assigned LGA receives zero counts', async () => {
  assert.deepEqual(await fixture({ lga: '' }).getDashboardStats(supervisor), { supporters: zeroCounts });
});

test('supervisor with an empty team receives zero for every status', async () => {
  assert.deepEqual(await fixture({ lga: 'assigned-lga' }).getDashboardStats(supervisor), { supporters: zeroCounts });
});

test('supervisor status subtotals are numeric and sum to the member total', async () => {
  const service = fixture({ lga: 'assigned-lga' }, [
    { status: 'verified', count: '2' },
    { status: 'rejected', count: '1' },
    { status: 'pending', count: '3' },
  ]);
  const expected = { supporters: { total: 6, verified: 2, rejected: 1, pending: 3 } };
  assert.deepEqual(await service.getDashboardStats(supervisor), expected);
  assert.deepEqual(await service.getDashboardStats(supervisor), expected);
});

test('missing review statuses display zero rather than missing values', async () => {
  const service = fixture({ lga: 'assigned-lga' }, [{ status: 'pending', count: '4' }]);
  assert.deepEqual(await service.getDashboardStats(supervisor), {
    supporters: { total: 4, verified: 0, rejected: 0, pending: 4 },
  });
});
