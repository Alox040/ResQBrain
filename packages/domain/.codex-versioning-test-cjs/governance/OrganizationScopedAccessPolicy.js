"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateOrganizationAccess = evaluateOrganizationAccess;
const AccessPolicy_1 = require("./AccessPolicy");
function deriveOrganizationAccessDenyReason(evaluation) {
    if (!evaluation.organizationScoped) {
        return 'cross-tenant-access-forbidden';
    }
    if (!evaluation.hasRequiredRole) {
        return 'role-not-granted-in-organization';
    }
    if (!evaluation.hasRequiredPermission) {
        return 'permission-not-granted-in-organization';
    }
    return undefined;
}
function evaluateOrganizationAccess(request) {
    const evaluation = (0, AccessPolicy_1.evaluateAccessPolicy)(request.subject, request.context, request.permission, request.role);
    return {
        allowed: evaluation.allowed,
        organizationScoped: evaluation.organizationScoped,
        hasRequiredRole: evaluation.hasRequiredRole,
        hasRequiredPermission: evaluation.hasRequiredPermission,
        evaluation,
        denyReason: deriveOrganizationAccessDenyReason(evaluation),
    };
}
