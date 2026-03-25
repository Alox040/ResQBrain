import { evaluateOrganizationAccess } from './OrganizationScopedAccessPolicy';
export const DEPRECATION_PERMISSION_MAP = {
    ContentEntity: 'content.deprecate',
    ContentPackage: 'package.deprecate',
};
function getDeprecationPermissionDenyReason(aggregate) {
    return aggregate === 'ContentEntity'
        ? 'content-deprecate-permission-required'
        : 'package-deprecate-permission-required';
}
export function authorizeDeprecation(request) {
    const accessDecision = evaluateOrganizationAccess({
        subject: request.subject,
        context: request.context,
        permission: DEPRECATION_PERMISSION_MAP[request.aggregate],
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
