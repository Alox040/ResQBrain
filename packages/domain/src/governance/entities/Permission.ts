import type { OrgId, PermissionId, UserRoleId } from '../../shared/types';

import { DomainError } from '../../shared/errors';
import type { EntityType } from '../../versioning/entities';
import type { Capability } from './Capability';

export const PermissionEntityScope = {
  ALL: 'All',
} as const;

export type PermissionEntityScope =
  | typeof PermissionEntityScope.ALL
  | EntityType;

export interface Permission {
  readonly id: PermissionId;
  readonly organizationId: OrgId;
  readonly userRoleId: UserRoleId;
  readonly capability: Capability;
  readonly entityScope: PermissionEntityScope;
}

export interface CreatePermissionInput {
  readonly id: PermissionId;
  readonly organizationId: OrgId;
  readonly userRoleId: UserRoleId;
  readonly capability: Capability;
  readonly entityScope: PermissionEntityScope;
}

export function createPermission(input: CreatePermissionInput): Permission {
  return Object.freeze({
    id: assertNonEmptyId(input.id, 'Permission.id'),
    organizationId: assertOrgId(input.organizationId, 'Permission.organizationId'),
    userRoleId: assertNonEmptyId(input.userRoleId, 'Permission.userRoleId'),
    capability: input.capability,
    entityScope: assertEntityScope(input.entityScope),
  });
}

function assertEntityScope(value: PermissionEntityScope): PermissionEntityScope {
  if (value === PermissionEntityScope.ALL) {
    return value;
  }

  return assertNonEmptyId(value, 'Permission.entityScope');
}

function assertOrgId(value: OrgId, field: string): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('MISSING_ORGANIZATION_CONTEXT', `${field} is required.`, {
      field,
    });
  }

  return value;
}

function assertNonEmptyId<TValue extends string>(value: TValue, field: string): TValue {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
      field,
    });
  }

  return value;
}
