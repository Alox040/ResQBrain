import assert from 'node:assert/strict';
import test from 'node:test';

import type { OrgId } from '../shared/types';
import { DataIntegrityViolation, DomainError, TenantIsolationViolation } from '../shared/errors';
import {
  assertNoImplicitTenantDerivation,
  assertOrgActive,
  assertSameOrg,
  contentSharingPolicyExists,
  createOrganization,
  OrganizationStatus,
  validateIntraOrgRef,
  validateOrgIdPresent,
} from './index';

const orgA = 'org-A' as OrgId;
const orgB = 'org-B' as OrgId;

test('validateOrgIdPresent accepts only explicit organizationId values', () => {
  assert.equal(validateOrgIdPresent(orgA), orgA);
  assert.throws(
    () => validateOrgIdPresent(undefined),
    (error) =>
      error instanceof DomainError &&
      error.code === 'MISSING_ORGANIZATION_CONTEXT',
  );
});

test('assertOrgActive allows only active organizations for writes', () => {
  const active = createOrganization({
    id: orgA,
    name: 'Org A',
    slug: 'org-a',
    status: OrganizationStatus.ACTIVE,
    createdAt: new Date('2026-03-25T00:00:00.000Z'),
  });

  assert.equal(assertOrgActive(active), active);

  const suspended = createOrganization({
    id: orgB,
    name: 'Org B',
    slug: 'org-b',
    status: OrganizationStatus.SUSPENDED,
    createdAt: new Date('2026-03-25T00:00:00.000Z'),
  });

  assert.throws(
    () => assertOrgActive(suspended),
    (error) =>
      error instanceof DomainError &&
      error.code === 'ORGANIZATION_NOT_ACTIVE',
  );

  const decommissioned = createOrganization({
    id: 'org-C' as OrgId,
    name: 'Org C',
    slug: 'org-c',
    status: OrganizationStatus.DECOMMISSIONED,
    createdAt: new Date('2026-03-25T00:00:00.000Z'),
  });

  assert.throws(
    () => assertOrgActive(decommissioned),
    (error) =>
      error instanceof DomainError &&
      error.code === 'ORGANIZATION_NOT_ACTIVE',
  );
});

test('assertSameOrg and validateIntraOrgRef deny cross-tenant references', () => {
  assert.deepEqual(
    assertSameOrg(
      { organizationId: orgA },
      { organizationId: orgA },
    ),
    [{ organizationId: orgA }, { organizationId: orgA }],
  );

  assert.throws(
    () => validateIntraOrgRef({ organizationId: orgA }, { organizationId: orgB }),
    (error) => error instanceof TenantIsolationViolation,
  );
});

test('contentSharingPolicyExists remains disabled in phase 0', () => {
  assert.equal(
    contentSharingPolicyExists(orgA, orgB, 'alg-1'),
    false,
  );
});

test('implicit tenant derivation from fallback context is rejected', () => {
  assert.throws(
    () =>
      assertNoImplicitTenantDerivation(undefined, {
        currentOrg: orgA,
      }),
    (error) => error instanceof DataIntegrityViolation,
  );
});
