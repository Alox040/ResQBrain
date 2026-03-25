"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseBundleGuardError = exports.RELEASE_BUNDLE_GUARD_CODES = void 0;
exports.isReleaseBundleApprovalStatus = isReleaseBundleApprovalStatus;
exports.isReleasedBundle = isReleasedBundle;
exports.isBundleWithinOrganizationScope = isBundleWithinOrganizationScope;
exports.hasApprovedBundleMembers = hasApprovedBundleMembers;
exports.canCreateReleaseBundle = canCreateReleaseBundle;
exports.assertReleaseBundleCandidate = assertReleaseBundleCandidate;
exports.assertBundleIsMutable = assertBundleIsMutable;
const ApprovalStatus_1 = require("../common/ApprovalStatus");
exports.RELEASE_BUNDLE_GUARD_CODES = [
    'organization-scope-required',
    'package-must-be-releasable',
    'members-required',
    'released-bundle-immutable',
];
class ReleaseBundleGuardError extends Error {
    code;
    constructor(code) {
        super(code);
        this.name = 'ReleaseBundleGuardError';
        this.code = code;
    }
}
exports.ReleaseBundleGuardError = ReleaseBundleGuardError;
function isReleaseBundleApprovalStatus(status) {
    return (0, ApprovalStatus_1.isReleaseSourceApprovalStatus)(status);
}
function isReleasedBundle(bundle) {
    return bundle.packageApprovalStatus === 'Released';
}
function isBundleWithinOrganizationScope(bundle, organizationId) {
    return bundle.organizationId === organizationId;
}
function hasApprovedBundleMembers(bundle) {
    return bundle.members.every((member) => member.approvalStatus === 'Approved' || member.approvalStatus === 'Released');
}
function canCreateReleaseBundle(bundle, organizationId) {
    return (isBundleWithinOrganizationScope(bundle, organizationId) &&
        isReleaseBundleApprovalStatus(bundle.packageApprovalStatus) &&
        bundle.members.length > 0 &&
        hasApprovedBundleMembers(bundle));
}
function assertReleaseBundleCandidate(bundle, organizationId) {
    if (!isBundleWithinOrganizationScope(bundle, organizationId)) {
        throw new ReleaseBundleGuardError('organization-scope-required');
    }
    if (!isReleaseBundleApprovalStatus(bundle.packageApprovalStatus)) {
        throw new ReleaseBundleGuardError('package-must-be-releasable');
    }
    if (bundle.members.length === 0) {
        throw new ReleaseBundleGuardError('members-required');
    }
    return bundle;
}
function assertBundleIsMutable(bundle) {
    if (isReleasedBundle(bundle)) {
        throw new ReleaseBundleGuardError('released-bundle-immutable');
    }
    return bundle;
}
