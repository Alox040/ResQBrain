import { DomainError } from '../../shared/errors';
export function createRegion(input) {
    const organizationId = assertOrgId(input.organization.id);
    return Object.freeze({
        id: assertEntityId(input.id, 'Region.id'),
        organizationId,
        name: assertNonEmptyString(input.name, 'Region.name'),
        code: assertNonEmptyString(input.code, 'Region.code'),
        status: input.status,
    });
}
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', 'Region.organizationId is required.');
    }
    return value;
}
function assertEntityId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
            field,
        });
    }
    return value;
}
function assertNonEmptyString(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
            field,
        });
    }
    return value.trim();
}
