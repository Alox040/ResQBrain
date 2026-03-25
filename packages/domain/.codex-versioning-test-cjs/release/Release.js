"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseGuardError = exports.RELEASE_INVARIANT_CODES = void 0;
exports.isRollbackRelease = isRollbackRelease;
exports.belongsToOrganization = belongsToOrganization;
exports.isReleaseCandidateWithinOrganization = isReleaseCandidateWithinOrganization;
exports.canCreateReleaseFromCandidate = canCreateReleaseFromCandidate;
exports.assertReleaseBelongsToOrganization = assertReleaseBelongsToOrganization;
exports.assertReleasableCandidate = assertReleasableCandidate;
const ApprovalStatus_1 = require("../common/ApprovalStatus");
exports.RELEASE_INVARIANT_CODES = [
    'tenant-boundary-required',
    'source-package-must-be-approved',
    'release-history-is-append-only',
    'released-artifacts-are-immutable',
];
class ReleaseGuardError extends Error {
    code;
    constructor(code) {
        super(code);
        this.name = 'ReleaseGuardError';
        this.code = code;
    }
}
exports.ReleaseGuardError = ReleaseGuardError;
function isRollbackRelease(release) {
    return release.previousReleaseId !== null;
}
function belongsToOrganization(release, organizationId) {
    return release.organizationId === organizationId;
}
function isReleaseCandidateWithinOrganization(candidate, context) {
    return candidate.organizationId === context.organizationId;
}
function canCreateReleaseFromCandidate(candidate, context) {
    return (isReleaseCandidateWithinOrganization(candidate, context) &&
        (0, ApprovalStatus_1.isReleaseSourceApprovalStatus)(candidate.packageApprovalStatus));
}
function assertReleaseBelongsToOrganization(release, organizationId) {
    if (!belongsToOrganization(release, organizationId)) {
        throw new ReleaseGuardError('tenant-boundary-required');
    }
    return release;
}
function assertReleasableCandidate(candidate, context) {
    if (!isReleaseCandidateWithinOrganization(candidate, context)) {
        throw new ReleaseGuardError('tenant-boundary-required');
    }
    if (!(0, ApprovalStatus_1.isReleaseSourceApprovalStatus)(candidate.packageApprovalStatus)) {
        throw new ReleaseGuardError('source-package-must-be-approved');
    }
    return candidate;
}
