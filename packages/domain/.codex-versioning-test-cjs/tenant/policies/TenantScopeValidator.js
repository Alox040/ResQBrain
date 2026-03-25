"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrgIdPresent = validateOrgIdPresent;
exports.assertSameOrg = assertSameOrg;
exports.assertOrgActive = assertOrgActive;
const errors_1 = require("../../shared/errors");
const entities_1 = require("../entities");
function validateOrgIdPresent(organizationId) {
    if (typeof organizationId !== 'string' || organizationId.trim().length === 0) {
        throw new errors_1.DomainError('MISSING_ORGANIZATION_CONTEXT', 'organizationId must be provided explicitly for every tenant-scoped operation.');
    }
    return organizationId;
}
function assertSameOrg(left, right) {
    const leftOrgId = validateOrgIdPresent(left.organizationId);
    const rightOrgId = validateOrgIdPresent(right.organizationId);
    if (leftOrgId !== rightOrgId) {
        throw new errors_1.TenantIsolationViolation('Cross-organization access is not permitted.', {
            leftOrganizationId: leftOrgId,
            rightOrganizationId: rightOrgId,
        });
    }
    return [left, right];
}
function assertOrgActive(organization) {
    const organizationId = validateOrgIdPresent(organization.id);
    if (organization.status !== entities_1.OrganizationStatus.ACTIVE) {
        throw new errors_1.DomainError('ORGANIZATION_NOT_ACTIVE', 'Only active organizations may perform write operations.', {
            organizationId,
            status: organization.status,
        });
    }
    return organization;
}
