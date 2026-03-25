"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStation = createStation;
const errors_1 = require("../../shared/errors");
function createStation(input) {
    const organizationId = assertOrgId(input.organization.id);
    if (input.region && input.region.organizationId !== organizationId) {
        throw new errors_1.DomainError('CROSS_TENANT_SCOPE_REFERENCE', 'Station.regionId must reference a Region within the same organization.', {
            organizationId,
            regionOrganizationId: input.region.organizationId,
        });
    }
    if (input.county && input.county.organizationId !== organizationId) {
        throw new errors_1.DomainError('CROSS_TENANT_SCOPE_REFERENCE', 'Station.countyId must reference a County within the same organization.', {
            organizationId,
            countyOrganizationId: input.county.organizationId,
        });
    }
    if (input.region &&
        input.county?.regionId &&
        input.county.regionId !== input.region.id) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'Station county and region hierarchy must be consistent.', {
            regionId: input.region.id,
            countyRegionId: input.county.regionId,
        });
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
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new errors_1.DomainError('MISSING_ORGANIZATION_CONTEXT', 'Station.organizationId is required.');
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
