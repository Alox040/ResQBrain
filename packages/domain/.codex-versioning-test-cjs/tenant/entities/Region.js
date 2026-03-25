"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegion = createRegion;
const errors_1 = require("../../shared/errors");
function createRegion(input) {
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
        throw new errors_1.DomainError('MISSING_ORGANIZATION_CONTEXT', 'Region.organizationId is required.');
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
