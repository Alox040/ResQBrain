import { DomainError } from '../../shared/errors';
export const PermissionEntityScope = {
    ALL: 'All',
};
export function createPermission(input) {
    return Object.freeze({
        id: assertNonEmptyId(input.id, 'Permission.id'),
        organizationId: assertOrgId(input.organizationId, 'Permission.organizationId'),
        userRoleId: assertNonEmptyId(input.userRoleId, 'Permission.userRoleId'),
        capability: input.capability,
        entityScope: assertEntityScope(input.entityScope),
    });
}
function assertEntityScope(value) {
    if (value === PermissionEntityScope.ALL) {
        return value;
    }
    return assertNonEmptyId(value, 'Permission.entityScope');
}
function assertOrgId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', `${field} is required.`, {
            field,
        });
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
