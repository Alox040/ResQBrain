import type { CountyId, OrgId, StationId } from '../../shared/types';

import { DomainError } from '../../shared/errors';
import type { Organization } from './Organization';
import type { County } from './County';
import type { Region } from './Region';
import { SubScopeStatus } from './SubScopeStatus';

export interface Station {
  readonly id: StationId;
  readonly organizationId: OrgId;
  readonly regionId?: Region['id'];
  readonly countyId?: CountyId;
  readonly name: string;
  readonly code: string;
  readonly status: SubScopeStatus;
}

export interface CreateStationInput {
  readonly id: StationId;
  readonly organization: Pick<Organization, 'id'>;
  readonly region?: Pick<Region, 'id' | 'organizationId'>;
  readonly county?: Pick<County, 'id' | 'organizationId' | 'regionId'>;
  readonly name: string;
  readonly code: string;
  readonly status: SubScopeStatus;
}

export function createStation(input: CreateStationInput): Station {
  const organizationId = assertOrgId(input.organization.id);

  if (input.region && input.region.organizationId !== organizationId) {
    throw new DomainError(
      'CROSS_TENANT_SCOPE_REFERENCE',
      'Station.regionId must reference a Region within the same organization.',
      {
        organizationId,
        regionOrganizationId: input.region.organizationId,
      },
    );
  }

  if (input.county && input.county.organizationId !== organizationId) {
    throw new DomainError(
      'CROSS_TENANT_SCOPE_REFERENCE',
      'Station.countyId must reference a County within the same organization.',
      {
        organizationId,
        countyOrganizationId: input.county.organizationId,
      },
    );
  }

  if (
    input.region &&
    input.county?.regionId &&
    input.county.regionId !== input.region.id
  ) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Station county and region hierarchy must be consistent.',
      {
        regionId: input.region.id,
        countyRegionId: input.county.regionId,
      },
    );
  }

  return Object.freeze({
    id: assertEntityId(input.id, 'Station.id'),
    organizationId,
    regionId: input.region?.id,
    countyId: input.county?.id,
    name: assertNonEmptyString(input.name, 'Station.name'),
    code: assertNonEmptyString(input.code, 'Station.code'),
    status: input.status,
  });
}

function assertOrgId(value: OrgId): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'Station.organizationId is required.',
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
