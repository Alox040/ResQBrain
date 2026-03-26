import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';
import { PermissionEntityScope } from '../entities/Permission';
import { isUserRoleActive } from '../entities/UserRole';
export function hasCapability(actor, capability, organizationId, options) {
    assertOrgId(organizationId);
    return getCapabilityGrantingRoles(actor, capability, organizationId, options).length > 0;
}
export function getCapabilityGrantingRoles(actor, capability, organizationId, options) {
    const at = options?.at ?? new Date();
    const entityType = options?.entityType;
    const targetScope = options?.targetScope ?? null;
    const activeRoles = actor.roles.filter((role) => role.userId === actor.userId &&
        role.organizationId === organizationId &&
        isUserRoleActive(role, at));
    return Object.freeze(activeRoles.filter((role) => actor.permissions.some((permission) => permission.organizationId === organizationId &&
        permission.userRoleId === role.id &&
        permission.capability === capability &&
        permissionMatchesEntity(permission, entityType) &&
        roleMatchesTargetScope(role, targetScope))));
}
function permissionMatchesEntity(permission, entityType) {
    if (permission.entityScope === PermissionEntityScope.ALL || entityType == null) {
        return true;
    }
    return permission.entityScope === entityType;
}
function roleMatchesTargetScope(role, targetScope) {
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
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', 'organizationId is required for capability evaluation.');
    }
    return value;
}
