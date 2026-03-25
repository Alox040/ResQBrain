import assert from 'node:assert/strict';
import test from 'node:test';

import type { CountyId, OrgId, RegionId, StationId } from '../shared/types';
import { DomainError } from '../shared/errors';
import {
  createCounty,
  createOrganization,
  createRegion,
  createStation,
  OrganizationStatus,
  SubScopeStatus,
} from './index';

const orgA = 'org-A' as OrgId;
const orgB = 'org-B' as OrgId;

test('tenant entities keep immutable organization-scoped identity', () => {
  const organization = createOrganization({
    id: orgA,
    name: 'Org A',
    slug: 'org-a',
    status: OrganizationStatus.ACTIVE,
    createdAt: new Date('2026-03-25T00:00:00.000Z'),
    auditTrail: [
      {
        changedAt: new Date('2026-03-25T00:00:00.000Z'),
        changeType: 'created',
        rationale: 'initial import',
      },
    ],
  });

  assert.equal(organization.id, orgA);
  assert.throws(() => {
    (organization as { id: OrgId }).id = orgB;
  });
  assert.throws(() => {
    (
      organization.auditTrail as unknown as Array<{ rationale: string }>
    )[0].rationale = 'mutated';
  });
});

test('sub-scope entities require an organization parent', () => {
  assert.throws(
    () =>
      createRegion({
        id: 'region-1' as RegionId,
        organization: { id: '' as OrgId },
        name: 'North',
        code: 'N',
        status: SubScopeStatus.ACTIVE,
      }),
    (error) =>
      error instanceof DomainError &&
      error.code === 'MISSING_ORGANIZATION_CONTEXT',
  );
});

test('county rejects a cross-organization region parent', () => {
  const region = createRegion({
    id: 'region-2' as RegionId,
    organization: { id: orgB },
    name: 'West',
    code: 'W',
    status: SubScopeStatus.ACTIVE,
  });

  assert.throws(
    () =>
      createCounty({
        id: 'county-1' as CountyId,
        organization: { id: orgA },
        region,
        name: 'County A',
        code: 'CA',
        status: SubScopeStatus.ACTIVE,
      }),
    (error) =>
      error instanceof DomainError &&
      error.code === 'CROSS_TENANT_SCOPE_REFERENCE',
  );
});

test('station rejects cross-organization region references', () => {
  const region = createRegion({
    id: 'region-3' as RegionId,
    organization: { id: orgB },
    name: 'South',
    code: 'S',
    status: SubScopeStatus.ACTIVE,
  });

  assert.throws(
    () =>
      createStation({
        id: 'station-1' as StationId,
        organization: { id: orgA },
        region,
        name: 'Station 1',
        code: 'S1',
        status: SubScopeStatus.ACTIVE,
      }),
    (error) =>
      error instanceof DomainError &&
      error.code === 'CROSS_TENANT_SCOPE_REFERENCE',
  );
});

test('inactive same-org region remains a valid structural parent', () => {
  const region = createRegion({
    id: 'region-4' as RegionId,
    organization: { id: orgA },
    name: 'Legacy Region',
    code: 'LR',
    status: SubScopeStatus.INACTIVE,
  });

  const station = createStation({
    id: 'station-2' as StationId,
    organization: { id: orgA },
    region,
    name: 'Station 2',
    code: 'S2',
    status: SubScopeStatus.ACTIVE,
  });

  assert.equal(station.regionId, region.id);
  assert.equal(station.organizationId, orgA);
});
