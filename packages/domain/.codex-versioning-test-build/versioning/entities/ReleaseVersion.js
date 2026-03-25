import { DomainError } from '../../shared/errors';
import { createCompositionEntry } from './CompositionEntry';
import { ReleaseStatus, } from './ReleaseStatus';
import { ReleaseType } from './ReleaseType';
import { freezeTargetScope, } from './ContentPackageVersion';
export function createReleaseVersion(input) {
    assertNonEmptyId(input.id, 'id');
    assertOrgId(input.organizationId);
    assertNonEmptyId(input.packageVersionId, 'packageVersionId');
    assertNonEmptyId(input.packageId, 'packageId');
    const releasedAt = cloneDate(input.releasedAt, 'releasedAt');
    assertNonEmptyId(input.releasedBy, 'releasedBy');
    const targetScope = freezeTargetScope(input.targetScope);
    const compositionSnapshot = Object.freeze(input.compositionSnapshot.map((entry) => createCompositionEntry(entry)));
    const status = assertReleaseStatus(input.status ?? ReleaseStatus.ACTIVE);
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
    if (value !== ReleaseStatus.ACTIVE && value !== ReleaseStatus.SUPERSEDED) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'status must be a valid release status.', { status: value });
    }
    return value;
}
function validateReleaseType(value) {
    if (value !== ReleaseType.INITIAL &&
        value !== ReleaseType.UPDATE &&
        value !== ReleaseType.ROLLBACK) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'releaseType must be a valid release type.', { releaseType: value });
    }
    return value;
}
export function markReleaseVersionSuperseded(releaseVersion) {
    if (releaseVersion.status === ReleaseStatus.SUPERSEDED) {
        return releaseVersion;
    }
    return Object.freeze({
        ...releaseVersion,
        status: ReleaseStatus.SUPERSEDED,
    });
}
function validateReleaseLinks(releaseType, supersededReleaseId, rollbackSourceVersionId) {
    if (releaseType === ReleaseType.INITIAL) {
        if (supersededReleaseId != null || rollbackSourceVersionId != null) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Initial releases must not carry supersession or rollback links.');
        }
        return;
    }
    if (supersededReleaseId == null) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Update and rollback releases require supersededReleaseId.');
    }
    if (releaseType === ReleaseType.ROLLBACK && rollbackSourceVersionId == null) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Rollback releases require rollbackSourceVersionId.');
    }
    if (releaseType === ReleaseType.UPDATE && rollbackSourceVersionId != null) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Update releases must not define rollbackSourceVersionId.');
    }
}
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', 'organizationId is required.');
    }
    return value;
}
function assertNonEmptyId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, { field });
    }
    return value;
}
function cloneDate(value, field) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a valid Date.`, { field });
    }
    return new Date(value.getTime());
}
