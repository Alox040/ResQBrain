import type { OrgId, RegionId } from '../../shared/types';

import { DomainError } from '../../shared/errors';
import type { Organization } from './Organization';
import type { HierarchicalSubScopeStatus } from './SubScopeStatus';

export interface Region {
  readonly id: RegionId;
  readonly organizationId: OrgId;
  readonly name: string;
  readonly code: string;
  readonly status: HierarchicalSubScopeStatus;
}

export interface CreateRegionInput {
  readonly id: RegionId;
  readonly organization: Pick<Organization, 'id'>;
  readonly name: string;
  readonly code: string;
  readonly status: HierarchicalSubScopeStatus;
}

export function createRegion(input: CreateRegionInput): Region {
  const organizationId = assertOrgId(input.organization.id);

  return Object.freeze({
    id: assertEntityId(input.id, 'Region.id'),
    organizationId,
    name: assertNonEmptyString(input.name, 'Region.name'),
    code: assertNonEmptyString(input.code, 'Region.code'),
    status: input.status,
  });
}

function assertOrgId(value: OrgId): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'Region.organizationId is required.',
    );
  }

  return value;
}

function assertEntityId<TId extends string>(value: TId, field: string): TId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
      field,
    });
  }

  return value;
}

function assertNonEmptyString(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
      field,
    });
  }

  return value.trim();
}
