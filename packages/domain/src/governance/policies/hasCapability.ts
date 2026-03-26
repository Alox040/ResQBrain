import type { OrgId } from '../../shared/types';

import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';
import type { EntityType } from '../../versioning/entities';
import {
  type Capability,
  type UserRole,
} from '../entities';
import type { Permission } from '../entities';
import { PermissionEntityScope } from '../entities/Permission';
import { isUserRoleActive } from '../entities/UserRole';
import type { ActorContext, ScopedTarget } from './PolicyContext';

export interface CapabilityCheckOptions {
  readonly entityType?: EntityType;
  readonly targetScope?: ScopedTarget | null;
  readonly at?: Date;
}

export function hasCapability(
  actor: ActorContext,
  capability: Capability,
  organizationId: OrgId,
  options?: CapabilityCheckOptions,
): boolean {
  assertOrgId(organizationId);

  return getCapabilityGrantingRoles(actor, capability, organizationId, options).length > 0;
}

export function getCapabilityGrantingRoles(
  actor: ActorContext,
  capability: Capability,
  organizationId: OrgId,
  options?: CapabilityCheckOptions,
): ReadonlyArray<UserRole> {
  const at = options?.at ?? new Date();
  const entityType = options?.entityType;
  const targetScope = options?.targetScope ?? null;
  const activeRoles = actor.roles.filter(
    (role) =>
      role.userId === actor.userId &&
      role.organizationId === organizationId &&
      isUserRoleActive(role, at),
  );

  return Object.freeze(
    activeRoles.filter((role) =>
      actor.permissions.some((permission) =>
        permission.organizationId === organizationId &&
        permission.userRoleId === role.id &&
        permission.capability === capability &&
        permissionMatchesEntity(permission, entityType) &&
        roleMatchesTargetScope(role, targetScope),
      ),
    ),
  );
}

function permissionMatchesEntity(
  permission: Permission,
  entityType: EntityType | undefined,
): boolean {
  if (permission.entityScope === PermissionEntityScope.ALL || entityType == null) {
    return true;
  }

  return permission.entityScope === entityType;
}

function roleMatchesTargetScope(
  role: UserRole,
  targetScope: ScopedTarget | null,
): boolean {
  if (role.scopeLevel === ScopeLevel.ORGANIZATION) {
    return true;
  }

  if (targetScope == null) {
    return false;
  }

  if (targetScope.scopeLevel !== role.scopeLevel) {
    return false;
  }

  return targetScope.scopeTargetId === role.scopeTargetId;
}

function assertOrgId(value: OrgId): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'organizationId is required for capability evaluation.',
    );
  }

  return value;
}
