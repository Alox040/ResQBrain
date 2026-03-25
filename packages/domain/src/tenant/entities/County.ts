import type { CountyId, OrgId } from '../../shared/types';

import { DomainError } from '../../shared/errors';
import type { Organization } from './Organization';
import type { Region } from './Region';
import type { HierarchicalSubScopeStatus } from './SubScopeStatus';

export interface County {
  readonly id: CountyId;
  readonly organizationId: OrgId;
  readonly regionId?: Region['id'];
  readonly name: string;
  readonly code: string;
  readonly status: HierarchicalSubScopeStatus;
}

export interface CreateCountyInput {
  readonly id: CountyId;
  readonly organization: Pick<Organization, 'id'>;
  readonly region?: Pick<Region, 'id' | 'organizationId'>;
  readonly name: string;
  readonly code: string;
  readonly status: HierarchicalSubScopeStatus;
}

export function createCounty(input: CreateCountyInput): County {
  const organizationId = assertOrgId(input.organization.id);

  if (input.region && input.region.organizationId !== organizationId) {
    throw new DomainError(
      'CROSS_TENANT_SCOPE_REFERENCE',
      'County.regionId must reference a Region within the same organization.',
      {
        organizationId,
        regionOrganizationId: input.region.organizationId,
      },
    );
  }

  return Object.freeze({
    id: assertEntityId(input.id, 'County.id'),
    organizationId,
    regionId: input.region?.id,
    name: assertNonEmptyString(input.name, 'County.name'),
    code: assertNonEmptyString(input.code, 'County.code'),
    status: input.status,
  });
}

function assertOrgId(value: OrgId): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'County.organizationId is required.',
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
