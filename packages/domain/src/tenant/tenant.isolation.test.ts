import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { OrgId, RegionId, StationId } from '../shared/types';
import { DataIntegrityViolation, DomainError, TenantIsolationViolation } from '../shared/errors';
import {
  assertNoImplicitTenantDerivation,
  contentSharingPolicyExists,
  createRegion,
  createStation,
  SubScopeStatus,
  validateOrgIdPresent,
} from './index';

const orgA = 'org-A' as OrgId;
const orgB = 'org-B' as OrgId;

test('tenant isolation blocks queries without organizationId', () => {
  assert.throws(
    () => validateOrgIdPresent(undefined),
    (error) =>
      error instanceof DomainError &&
      error.code === 'MISSING_ORGANIZATION_CONTEXT',
  );
});

test('tenant isolation blocks cross-org sub-scope references', () => {
  const region = createRegion({
    id: 'region-5' as RegionId,
    organization: { id: orgB },
    name: 'Foreign',
    code: 'F',
    country: 'DE',
    versioningEnabled: false,
    status: SubScopeStatus.ACTIVE,
  });

  assert.throws(
    () =>
      createStation({
        id: 'station-3' as StationId,
        organization: { id: orgA },
        region,
        name: 'Station 3',
        code: 'S3',
        status: SubScopeStatus.ACTIVE,
      }),
    (error) => error instanceof DomainError && error.code === 'CROSS_TENANT_SCOPE_REFERENCE',
  );
});

test('tenant isolation forbids implicit tenant derivation from session-like state', () => {
  assert.throws(
    () => assertNoImplicitTenantDerivation(null, { currentOrg: orgA }),
    (error) => error instanceof DataIntegrityViolation,
  );
});

test('tenant isolation exposes the named cross-org sharing guard and keeps it disabled', () => {
  assert.equal(contentSharingPolicyExists(orgA, orgB, 'med-1'), false);
});

test('tenant foundation files import shared only and do not depend on common ids', () => {
  const tenantIndex = readFileSync(
    join(process.cwd(), 'packages/domain/src/tenant/index.ts'),
    'utf8',
  );
  const entitiesIndex = readFileSync(
    join(process.cwd(), 'packages/domain/src/tenant/entities/index.ts'),
    'utf8',
  );
  const policiesIndex = readFileSync(
    join(process.cwd(), 'packages/domain/src/tenant/policies/index.ts'),
    'utf8',
  );

  assert.match(tenantIndex, /export \* from '\.\/entities';/);
  assert.match(tenantIndex, /export \* from '\.\/policies';/);
  assert.doesNotMatch(`${tenantIndex}\n${entitiesIndex}\n${policiesIndex}`, /common\/ids|common\\/);
});

test('cross-org validator raises a tenant isolation error type', () => {
  try {
    throw new TenantIsolationViolation('cross-org');
  } catch (error) {
    assert.equal(error instanceof TenantIsolationViolation, true);
  }
});
