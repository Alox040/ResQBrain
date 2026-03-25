"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRelease = authorizeRelease;
const ApprovalStatus_1 = require("../common/ApprovalStatus");
const OrganizationScopedAccessPolicy_1 = require("./OrganizationScopedAccessPolicy");
const Release_1 = require("../release/Release");
function authorizeRelease(request) {
    const accessDecision = (0, OrganizationScopedAccessPolicy_1.evaluateOrganizationAccess)({
        subject: request.subject,
        context: request.context,
        permission: 'package.release',
        role: 'Releaser',
    });
    if (!(0, Release_1.isReleaseCandidateWithinOrganization)(request.candidate, request.context)) {
        return {
            allowed: false,
            evaluation: accessDecision.evaluation,
            denyReason: 'candidate-not-in-organization-scope',
        };
    }
    if (!(0, ApprovalStatus_1.isReleaseSourceApprovalStatus)(request.candidate.packageApprovalStatus)) {
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
