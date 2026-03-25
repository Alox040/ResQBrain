import { isReleaseSourceApprovalStatus } from '../common/ApprovalStatus';
import { evaluateOrganizationAccess } from './OrganizationScopedAccessPolicy';
import { isReleaseCandidateWithinOrganization } from '../release/Release';
export function authorizeRelease(request) {
    const accessDecision = evaluateOrganizationAccess({
        subject: request.subject,
        context: request.context,
        permission: 'package.release',
        role: 'Releaser',
    });
    if (!isReleaseCandidateWithinOrganization(request.candidate, request.context)) {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: 'candidate-not-in-organization-scope',
        };
    }
    if (!isReleaseSourceApprovalStatus(request.candidate.packageApprovalStatus)) {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: 'candidate-package-not-approved',
        };
    }
    if (!accessDecision.organizationScoped) {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: 'cross-tenant-release-forbidden',
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
            denyReason: 'package-release-permission-required',
        };
    }
    return {
        allowed: true,
        evaluation: accessDecision.evaluation,
    };
}
