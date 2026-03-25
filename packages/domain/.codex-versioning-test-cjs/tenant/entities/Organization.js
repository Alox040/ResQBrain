"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganization = createOrganization;
const errors_1 = require("../../shared/errors");
function createOrganization(input) {
    assertOrgId(input.id);
    assertNonEmptyString(input.name, 'name');
    assertNonEmptyString(input.slug, 'slug');
    assertDate(input.createdAt, 'createdAt');
    const auditTrail = Object.freeze((input.auditTrail ?? []).map((entry) => Object.freeze({
        changedAt: cloneDate(entry.changedAt, 'auditTrail.changedAt'),
        changeType: assertNonEmptyString(entry.changeType, 'auditTrail.changeType'),
        rationale: assertNonEmptyString(entry.rationale, 'auditTrail.rationale'),
    })));
    return Object.freeze({
        id: input.id,
        name: input.name.trim(),
        slug: input.slug.trim(),
        status: input.status,
        createdAt: cloneDate(input.createdAt, 'createdAt'),
        auditTrail,
    });
}
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new errors_1.DomainError('MISSING_ORGANIZATION_CONTEXT', 'Organization.id is required.');
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
function assertDate(value, field) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a valid Date.`, {
            field,
        });
    }
    return value;
}
function cloneDate(value, field) {
    return new Date(assertDate(value, field).getTime());
}
