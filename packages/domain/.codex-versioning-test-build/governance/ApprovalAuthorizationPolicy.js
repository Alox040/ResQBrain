import { evaluateOrganizationAccess } from './OrganizationScopedAccessPolicy';
export const APPROVAL_PERMISSION_MAP = {
    approve: {
        ContentEntity: 'content.approve',
        ContentPackage: 'package.approve',
    },
    reject: {
        ContentEntity: 'content.reject',
        ContentPackage: 'package.reject',
    },
};
function getApprovalPermissionDenyReason(action, aggregate) {
    if (aggregate === 'ContentEntity') {
        return action === 'approve'
            ? 'content-approve-permission-required'
            : 'content-reject-permission-required';
    }
    return action === 'approve'
        ? 'package-approve-permission-required'
        : 'package-reject-permission-required';
}
export function authorizeApproval(request) {
    const permission = APPROVAL_PERMISSION_MAP[request.action][request.aggregate];
    const accessDecision = evaluateOrganizationAccess({
        subject: request.subject,
        context: request.context,
        permission,
        role: 'Approver',
    });
    if (!accessDecision.organizationScoped) {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: 'cross-tenant-access-forbidden',
        };
    }
    if (!accessDecision.hasRequiredRole) {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: 'approver-role-required',
        };
    }
    if (!accessDecision.hasRequiredPermission) {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: getApprovalPermissionDenyReason(request.action, request.aggregate),
        };
    }
    return {
        allowed: true,
        evaluation: accessDecision.evaluation,
    };
}
