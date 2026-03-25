"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEPRECATION_PERMISSION_MAP = void 0;
exports.authorizeDeprecation = authorizeDeprecation;
const OrganizationScopedAccessPolicy_1 = require("./OrganizationScopedAccessPolicy");
exports.DEPRECATION_PERMISSION_MAP = {
    ContentEntity: 'content.deprecate',
    ContentPackage: 'package.deprecate',
};
function getDeprecationPermissionDenyReason(aggregate) {
    return aggregate === 'ContentEntity'
        ? 'content-deprecate-permission-required'
        : 'package-deprecate-permission-required';
}
function authorizeDeprecation(request) {
    const accessDecision = (0, OrganizationScopedAccessPolicy_1.evaluateOrganizationAccess)({
        subject: request.subject,
        context: request.context,
        permission: exports.DEPRECATION_PERMISSION_MAP[request.aggregate],
        role: 'Releaser',
    });
    if (request.fromStatus !== 'Released') {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: 'source-status-must-be-released',
        };
    }
    if (!accessDecision.organizationScoped) {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: 'cross-tenant-deprecation-forbidden',
        };
    }
    if (!accessDecision.hasRequiredRole) {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: 'releaser-role-required',
        };
    }
    if (!accessDecision.hasRequiredPermission) {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: getDeprecationPermissionDenyReason(request.aggregate),
        };
    }
    return {
        allowed: true,
        evaluation: accessDecision.evaluation,
    };
}
