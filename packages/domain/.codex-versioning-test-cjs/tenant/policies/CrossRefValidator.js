"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIntraOrgRef = validateIntraOrgRef;
exports.validateOptionalIntraOrgRef = validateOptionalIntraOrgRef;
exports.validateHierarchyEdge = validateHierarchyEdge;
exports.assertNoImplicitTenantDerivation = assertNoImplicitTenantDerivation;
const errors_1 = require("../../shared/errors");
const TenantScopeValidator_1 = require("./TenantScopeValidator");
function validateIntraOrgRef(source, target) {
    return (0, TenantScopeValidator_1.assertSameOrg)(source, target);
}
function validateOptionalIntraOrgRef(source, target) {
    if (!target) {
        return null;
    }
    return validateIntraOrgRef(source, target);
}
function validateHierarchyEdge(parent, child) {
    return (0, TenantScopeValidator_1.assertSameOrg)(parent, child);
}
function assertNoImplicitTenantDerivation(organizationId, fallbackContext) {
    if (typeof organizationId === 'string' && organizationId.trim().length > 0) {
        return;
    }
    throw new errors_1.DataIntegrityViolation('organizationId must be supplied explicitly and cannot be derived from fallback context.', {
        fallbackContext: fallbackContext ?? null,
    });
}
