import assert from 'node:assert/strict';
import test from 'node:test';

import { createLookupServices } from './createLookupServices';

test('createLookupServices wires all lookup services to working in-memory adapters', async () => {
  const services = createLookupServices();

  const algorithmItems = await services.getAlgorithmListService.execute({
    organizationId: 'pilot-wache-001' as Parameters<typeof services.getAlgorithmListService.execute>[0]['organizationId'],
  });

  const medicationItems = await services.getMedicationListService.execute({
    organizationId: 'pilot-wache-001' as Parameters<typeof services.getMedicationListService.execute>[0]['organizationId'],
  });

  const searchItems = await services.searchLookupContentService.execute({
    organizationId: 'pilot-wache-001' as Parameters<typeof services.searchLookupContentService.execute>[0]['organizationId'],
    searchTerm: 'adrenalin',
  });

  assert.equal(typeof services.getAlgorithmDetailService.execute, 'function');
  assert.equal(typeof services.getMedicationDetailService.execute, 'function');
  assert.equal(algorithmItems.length, 3);
  assert.equal(medicationItems.length, 3);
  assert.deepEqual(
    searchItems.map((item) => item.id),
    ['alg-cpr-adult', 'alg-anaphylaxis', 'med-adrenalin'],
  );
});
