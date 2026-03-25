import type { OrgId } from '../../shared/types';

import { DomainError, TenantIsolationViolation } from '../../shared/errors';
import { OrganizationStatus, type Organization } from '../entities';

export interface TenantScopedRecord {
  readonly organizationId: OrgId;
}

export function validateOrgIdPresent(
  organizationId: OrgId | null | undefined,
): OrgId {
  if (typeof organizationId !== 'string' || organizationId.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'organizationId must be provided explicitly for every tenant-scoped operation.',
    );
  }

  return organizationId;
}

export function assertSameOrg<TLeft extends TenantScopedRecord, TRight extends TenantScopedRecord>(
  left: TLeft,
  right: TRight,
): readonly [TLeft, TRight] {
  const leftOrgId = validateOrgIdPresent(left.organizationId);
  const rightOrgId = validateOrgIdPresent(right.organizationId);

  if (leftOrgId !== rightOrgId) {
    throw new TenantIsolationViolation(
      'Cross-organization access is not permitted.',
      {
        leftOrganizationId: leftOrgId,
        rightOrganizationId: rightOrgId,
      },
    );
  }

  return [left, right] as const;
}

export function assertOrgActive<TOrganization extends Pick<Organization, 'id' | 'status'>>(
  organization: TOrganization,
): TOrganization {
  const organizationId = validateOrgIdPresent(organization.id);

  if (organization.status !== OrganizationStatus.ACTIVE) {
    throw new DomainError(
      'ORGANIZATION_NOT_ACTIVE',
      'Only active organizations may perform write operations.',
      {
        organizationId,
        status: organization.status,
      },
    );
  }

  return organization;
}
