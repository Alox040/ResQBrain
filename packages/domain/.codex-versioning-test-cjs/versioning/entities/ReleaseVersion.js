"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReleaseVersion = createReleaseVersion;
exports.markReleaseVersionSuperseded = markReleaseVersionSuperseded;
const errors_1 = require("../../shared/errors");
const CompositionEntry_1 = require("./CompositionEntry");
const ReleaseStatus_1 = require("./ReleaseStatus");
const ReleaseType_1 = require("./ReleaseType");
const ContentPackageVersion_1 = require("./ContentPackageVersion");
function createReleaseVersion(input) {
    assertNonEmptyId(input.id, 'id');
    assertOrgId(input.organizationId);
    assertNonEmptyId(input.packageVersionId, 'packageVersionId');
    assertNonEmptyId(input.packageId, 'packageId');
    const releasedAt = cloneDate(input.releasedAt, 'releasedAt');
    assertNonEmptyId(input.releasedBy, 'releasedBy');
    const targetScope = (0, ContentPackageVersion_1.freezeTargetScope)(input.targetScope);
    const compositionSnapshot = Object.freeze(input.compositionSnapshot.map((entry) => (0, CompositionEntry_1.createCompositionEntry)(entry)));
    const status = assertReleaseStatus(input.status ?? ReleaseStatus_1.ReleaseStatus.ACTIVE);
    validateReleaseType(input.releaseType);
    validateReleaseLinks(input.releaseType, input.supersededReleaseId ?? null, input.rollbackSourceVersionId ?? null);
    return Object.freeze({
        kind: 'ReleaseVersion',
        id: input.id,
        organizationId: input.organizationId,
        packageVersionId: input.packageVersionId,
        packageId: input.packageId,
        releasedAt,
        releasedBy: input.releasedBy,
        targetScope,
        releaseType: input.releaseType,
        supersededReleaseId: input.supersededReleaseId ?? null,
        rollbackSourceVersionId: input.rollbackSourceVersionId ?? null,
        compositionSnapshot,
        status,
    });
}
function assertReleaseStatus(value) {
    if (value !== ReleaseStatus_1.ReleaseStatus.ACTIVE && value !== ReleaseStatus_1.ReleaseStatus.SUPERSEDED) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'status must be a valid release status.', { status: value });
    }
    return value;
}
function validateReleaseType(value) {
    if (value !== ReleaseType_1.ReleaseType.INITIAL &&
        value !== ReleaseType_1.ReleaseType.UPDATE &&
        value !== ReleaseType_1.ReleaseType.ROLLBACK) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'releaseType must be a valid release type.', { releaseType: value });
    }
    return value;
}
function markReleaseVersionSuperseded(releaseVersion) {
    if (releaseVersion.status === ReleaseStatus_1.ReleaseStatus.SUPERSEDED) {
        return releaseVersion;
    }
    return Object.freeze({
        ...releaseVersion,
        status: ReleaseStatus_1.ReleaseStatus.SUPERSEDED,
    });
}
function validateReleaseLinks(releaseType, supersededReleaseId, rollbackSourceVersionId) {
    if (releaseType === ReleaseType_1.ReleaseType.INITIAL) {
        if (supersededReleaseId != null || rollbackSourceVersionId != null) {
            throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'Initial releases must not carry supersession or rollback links.');
        }
        return;
    }
    if (supersededReleaseId == null) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'Update and rollback releases require supersededReleaseId.');
    }
    if (releaseType === ReleaseType_1.ReleaseType.ROLLBACK && rollbackSourceVersionId == null) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'Rollback releases require rollbackSourceVersionId.');
    }
    if (releaseType === ReleaseType_1.ReleaseType.UPDATE && rollbackSourceVersionId != null) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'Update releases must not define rollbackSourceVersionId.');
    }
}
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new errors_1.DomainError('MISSING_ORGANIZATION_CONTEXT', 'organizationId is required.');
    }
    return value;
}
function assertNonEmptyId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, { field });
    }
    return value;
}
function cloneDate(value, field) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a valid Date.`, { field });
    }
    return new Date(value.getTime());
}
