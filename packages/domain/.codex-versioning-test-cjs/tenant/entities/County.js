"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCounty = createCounty;
const errors_1 = require("../../shared/errors");
function createCounty(input) {
    const organizationId = assertOrgId(input.organization.id);
    if (input.region && input.region.organizationId !== organizationId) {
        throw new errors_1.DomainError('CROSS_TENANT_SCOPE_REFERENCE', 'County.regionId must reference a Region within the same organization.', {
            organizationId,
            regionOrganizationId: input.region.organizationId,
        });
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
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new errors_1.DomainError('MISSING_ORGANIZATION_CONTEXT', 'County.organizationId is required.');
    }
    return value;
}
function assertEntityId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
            field,
        });
    }
    return value;
}
function assertNonEmptyString(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
            field,
        });
    }
    return value.trim();
}
