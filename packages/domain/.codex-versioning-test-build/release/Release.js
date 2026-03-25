import { isReleaseSourceApprovalStatus } from '../common/ApprovalStatus';
export const RELEASE_INVARIANT_CODES = [
    'tenant-boundary-required',
    'source-package-must-be-approved',
    'release-history-is-append-only',
    'released-artifacts-are-immutable',
];
export class ReleaseGuardError extends Error {
    code;
    constructor(code) {
        super(code);
        this.name = 'ReleaseGuardError';
        this.code = code;
    }
}
export function isRollbackRelease(release) {
    return release.previousReleaseId !== null;
}
export function belongsToOrganization(release, organizationId) {
    return release.organizationId === organizationId;
}
export function isReleaseCandidateWithinOrganization(candidate, context) {
    return candidate.organizationId === context.organizationId;
}
export function canCreateReleaseFromCandidate(candidate, context) {
    return (isReleaseCandidateWithinOrganization(candidate, context) &&
        isReleaseSourceApprovalStatus(candidate.packageApprovalStatus));
}
export function assertReleaseBelongsToOrganization(release, organizationId) {
    if (!belongsToOrganization(release, organizationId)) {
        throw new ReleaseGuardError('tenant-boundary-required');
    }
    return release;
}
export function assertReleasableCandidate(candidate, context) {
    if (!isReleaseCandidateWithinOrganization(candidate, context)) {
        throw new ReleaseGuardError('tenant-boundary-required');
    }
    if (!isReleaseSourceApprovalStatus(candidate.packageApprovalStatus)) {
        throw new ReleaseGuardError('source-package-must-be-approved');
    }
    return candidate;
}
