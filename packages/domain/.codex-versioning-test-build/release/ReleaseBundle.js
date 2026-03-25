import { isReleaseSourceApprovalStatus } from '../common/ApprovalStatus';
export const RELEASE_BUNDLE_GUARD_CODES = [
    'organization-scope-required',
    'package-must-be-releasable',
    'members-required',
    'released-bundle-immutable',
];
export class ReleaseBundleGuardError extends Error {
    code;
    constructor(code) {
        super(code);
        this.name = 'ReleaseBundleGuardError';
        this.code = code;
    }
}
export function isReleaseBundleApprovalStatus(status) {
    return isReleaseSourceApprovalStatus(status);
}
export function isReleasedBundle(bundle) {
    return bundle.packageApprovalStatus === 'Released';
}
export function isBundleWithinOrganizationScope(bundle, organizationId) {
    return bundle.organizationId === organizationId;
}
export function hasApprovedBundleMembers(bundle) {
    return bundle.members.every((member) => member.approvalStatus === 'Approved' || member.approvalStatus === 'Released');
}
export function canCreateReleaseBundle(bundle, organizationId) {
    return (isBundleWithinOrganizationScope(bundle, organizationId) &&
        isReleaseBundleApprovalStatus(bundle.packageApprovalStatus) &&
        bundle.members.length > 0 &&
        hasApprovedBundleMembers(bundle));
}
export function assertReleaseBundleCandidate(bundle, organizationId) {
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
export function assertBundleIsMutable(bundle) {
    if (isReleasedBundle(bundle)) {
        throw new ReleaseBundleGuardError('released-bundle-immutable');
    }
    return bundle;
}
