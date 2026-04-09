import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  GetAlgorithmDetailQuery,
  GetAlgorithmListQuery,
} from '../../../../application/src/lookup';
import { LOOKUP_PILOT_ORGANIZATION_ID, LOOKUP_PILOT_REGION_ID, LOOKUP_PILOT_STATION_ID, LOOKUP_PILOT_VERSION_ID } from '../mock-data/algorithms';
import { InMemoryAlgorithmReadRepository } from './InMemoryAlgorithmReadRepository';

test('InMemoryAlgorithmReadRepository.listReleased returns only released pilot-scope content', async () => {
  const repository = new InMemoryAlgorithmReadRepository();

  const query: GetAlgorithmListQuery = {
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    releasedOnly: true,
  };

  const items = await repository.listReleased(query);

  assert.equal(items.length, 3);
  assert.ok(items.every((item) => item.organizationId === LOOKUP_PILOT_ORGANIZATION_ID));
  assert.ok(items.every((item) => item.currentReleasedVersionId === LOOKUP_PILOT_VERSION_ID));
});

test('InMemoryAlgorithmReadRepository.getReleasedById returns tenant-scoped data only', async () => {
  const repository = new InMemoryAlgorithmReadRepository();

  const allowedQuery: GetAlgorithmDetailQuery = {
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    entityId: 'alg-cpr-adult' as GetAlgorithmDetailQuery['entityId'],
    releasedOnly: true,
  };

  const deniedQuery: GetAlgorithmDetailQuery = {
    ...allowedQuery,
    organizationId: 'other-org' as GetAlgorithmDetailQuery['organizationId'],
  };

  const allowedItem = await repository.getReleasedById(allowedQuery);
  const deniedItem = await repository.getReleasedById(deniedQuery);

  assert.ok(allowedItem);
  assert.equal(allowedItem.id, 'alg-cpr-adult');
  assert.equal(deniedItem, null);
});

test('InMemoryAlgorithmReadRepository applies region and station filters deterministically', async () => {
  const repository = new InMemoryAlgorithmReadRepository();

  const matchingItems = await repository.listReleased({
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: LOOKUP_PILOT_REGION_ID,
    stationId: LOOKUP_PILOT_STATION_ID,
    releasedOnly: true,
  });

  const regionMismatchItems = await repository.listReleased({
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: 'other-region' as GetAlgorithmListQuery['regionId'],
    releasedOnly: true,
  });

  const stationMismatchItems = await repository.listReleased({
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    stationId: 'other-station' as GetAlgorithmListQuery['stationId'],
    releasedOnly: true,
  });

  assert.deepEqual(
    matchingItems.map((item) => item.id),
    ['alg-cpr-adult'],
  );
  assert.deepEqual(regionMismatchItems, []);
  assert.deepEqual(stationMismatchItems, []);
});
