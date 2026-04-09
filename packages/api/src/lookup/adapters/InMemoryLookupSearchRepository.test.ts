import assert from 'node:assert/strict';
import test from 'node:test';

import type { SearchLookupContentQuery } from '../../../../application/src/lookup';
import {
  LOOKUP_PILOT_ORGANIZATION_ID,
  LOOKUP_PILOT_REGION_ID,
  LOOKUP_PILOT_STATION_ID,
  LOOKUP_PILOT_VERSION_ID,
} from '../mock-data/algorithms';
import { InMemoryLookupSearchRepository } from './InMemoryLookupSearchRepository';

test('InMemoryLookupSearchRepository.searchReleased returns only released hits', async () => {
  const repository = new InMemoryLookupSearchRepository();

  const query: SearchLookupContentQuery = {
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    searchTerm: 'adrenalin',
    releasedOnly: true,
  };

  const items = await repository.searchReleased(query);

  assert.deepEqual(
    items.map((item) => item.id),
    ['alg-cpr-adult', 'alg-anaphylaxis', 'med-adrenalin'],
  );
  assert.ok(items.every((item) => item.organizationId === LOOKUP_PILOT_ORGANIZATION_ID));
  assert.ok(items.every((item) => item.currentReleasedVersionId === LOOKUP_PILOT_VERSION_ID));
});

test('InMemoryLookupSearchRepository.searchReleased stays tenant-scoped', async () => {
  const repository = new InMemoryLookupSearchRepository();

  const items = await repository.searchReleased({
    organizationId: 'other-org' as SearchLookupContentQuery['organizationId'],
    searchTerm: 'adrenalin',
    releasedOnly: true,
  });

  assert.deepEqual(items, []);
});

test('InMemoryLookupSearchRepository.searchReleased applies region and station filters deterministically', async () => {
  const repository = new InMemoryLookupSearchRepository();

  const matchingItems = await repository.searchReleased({
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: LOOKUP_PILOT_REGION_ID,
    stationId: LOOKUP_PILOT_STATION_ID,
    searchTerm: 'adrenalin',
    releasedOnly: true,
  });

  const regionMismatchItems = await repository.searchReleased({
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: 'other-region' as SearchLookupContentQuery['regionId'],
    searchTerm: 'adrenalin',
    releasedOnly: true,
  });

  const stationMismatchItems = await repository.searchReleased({
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    stationId: 'other-station' as SearchLookupContentQuery['stationId'],
    searchTerm: 'adrenalin',
    releasedOnly: true,
  });

  assert.deepEqual(
    matchingItems.map((item) => item.id),
    ['alg-cpr-adult', 'med-adrenalin'],
  );
  assert.deepEqual(regionMismatchItems, []);
  assert.deepEqual(stationMismatchItems, []);
});
