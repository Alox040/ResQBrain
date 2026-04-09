import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  GetMedicationDetailQuery,
  GetMedicationListQuery,
} from '../../../../application/src/lookup';
import {
  LOOKUP_PILOT_ORGANIZATION_ID,
  LOOKUP_PILOT_REGION_ID,
  LOOKUP_PILOT_VERSION_ID,
} from '../mock-data/algorithms';
import { InMemoryMedicationReadRepository } from './InMemoryMedicationReadRepository';

test('InMemoryMedicationReadRepository.listReleased returns only released pilot-scope content', async () => {
  const repository = new InMemoryMedicationReadRepository();

  const query: GetMedicationListQuery = {
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    releasedOnly: true,
  };

  const items = await repository.listReleased(query);

  assert.equal(items.length, 3);
  assert.ok(items.every((item) => item.organizationId === LOOKUP_PILOT_ORGANIZATION_ID));
  assert.ok(items.every((item) => item.currentReleasedVersionId === LOOKUP_PILOT_VERSION_ID));
});

test('InMemoryMedicationReadRepository.getReleasedById returns tenant-scoped data only', async () => {
  const repository = new InMemoryMedicationReadRepository();

  const allowedQuery: GetMedicationDetailQuery = {
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    entityId: 'med-adrenalin' as GetMedicationDetailQuery['entityId'],
    releasedOnly: true,
  };

  const deniedQuery: GetMedicationDetailQuery = {
    ...allowedQuery,
    organizationId: 'other-org' as GetMedicationDetailQuery['organizationId'],
  };

  const allowedItem = await repository.getReleasedById(allowedQuery);
  const deniedItem = await repository.getReleasedById(deniedQuery);

  assert.ok(allowedItem);
  assert.equal(allowedItem.id, 'med-adrenalin');
  assert.equal(deniedItem, null);
});

test('InMemoryMedicationReadRepository applies region and station filters deterministically', async () => {
  const repository = new InMemoryMedicationReadRepository();

  const matchingItems = await repository.listReleased({
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: LOOKUP_PILOT_REGION_ID,
    releasedOnly: true,
  });

  const regionMismatchItems = await repository.listReleased({
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: 'other-region' as GetMedicationListQuery['regionId'],
    releasedOnly: true,
  });

  const stationMismatchItems = await repository.listReleased({
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    stationId: 'other-station' as GetMedicationListQuery['stationId'],
    releasedOnly: true,
  });

  assert.deepEqual(
    matchingItems.map((item) => item.id),
    ['med-adrenalin', 'med-salbutamol'],
  );
  assert.deepEqual(regionMismatchItems, []);
  assert.deepEqual(stationMismatchItems, []);
});
