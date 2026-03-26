import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';
export function createUserRole(input) {
    const organizationId = assertOrgId(input.organizationId);
    const assignedAt = cloneDate(input.assignedAt, 'UserRole.assignedAt');
    const expiresAt = cloneOptionalDate(input.expiresAt, 'UserRole.expiresAt');
    const revokedAt = cloneOptionalDate(input.revokedAt, 'UserRole.revokedAt');
    if (expiresAt && expiresAt.getTime() <= assignedAt.getTime()) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'UserRole.expiresAt must be after assignedAt.');
    }
    if (revokedAt && revokedAt.getTime() < assignedAt.getTime()) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'UserRole.revokedAt cannot precede assignedAt.');
    }
    return Object.freeze({
        id: assertNonEmptyId(input.id, 'UserRole.id'),
        organizationId,
        userId: assertNonEmptyId(input.userId, 'UserRole.userId'),
        roleType: input.roleType,
        scopeLevel: input.scopeLevel,
        scopeTargetId: normalizeScopeTarget(input.scopeLevel, organizationId, input.scopeTarget),
        assignedAt,
        assignedBy: assertNonEmptyId(input.assignedBy, 'UserRole.assignedBy'),
        expiresAt,
        revokedAt,
    });
}
export function isUserRoleActive(userRole, at) {
    const instant = cloneDate(at, 'at');
    if (userRole.revokedAt != null && userRole.revokedAt.getTime() <= instant.getTime()) {
        return false;
    }
    if (userRole.expiresAt != null && userRole.expiresAt.getTime() < instant.getTime()) {
        return false;
    }
    return true;
}
function normalizeScopeTarget(scopeLevel, organizationId, scopeTarget) {
    if (scopeLevel === ScopeLevel.ORGANIZATION) {
        if (scopeTarget != null) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Organization-scoped UserRole must not define scopeTargetId.');
        }
        return null;
    }
    if (scopeTarget == null) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Non-organization scoped UserRole requires scopeTargetId.');
    }
    if (scopeTarget.organizationId !== organizationId) {
        throw new DomainError('CROSS_TENANT_SCOPE_REFERENCE', 'UserRole.scopeTargetId must resolve within the same organization.', {
            organizationId,
            scopeTargetOrganizationId: scopeTarget.organizationId,
        });
    }
    return assertNonEmptyId(scopeTarget.id, 'UserRole.scopeTargetId');
}
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', 'UserRole.organizationId is required.');
    }
    return value;
}
function assertNonEmptyId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
            field,
        });
    }
    return value;
}
function cloneOptionalDate(value, field) {
    if (value == null) {
        return null;
    }
    return cloneDate(value, field);
}
function cloneDate(value, field) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a valid Date.`, { field });
    }
    return new Date(value.getTime());
}
