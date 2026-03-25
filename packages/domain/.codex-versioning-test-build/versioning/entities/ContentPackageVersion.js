import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';
import { createCompositionEntry } from './CompositionEntry';
import { appendLineageStates, createLineageStateSet, LineageState, } from './LineageState';
export function createContentPackageVersion(input) {
    assertNonEmptyId(input.id, 'id');
    assertOrgId(input.organizationId);
    assertNonEmptyId(input.packageId, 'packageId');
    const createdAt = cloneDate(input.createdAt, 'createdAt');
    assertNonEmptyId(input.createdBy, 'createdBy');
    const targetScope = freezeTargetScope(input.targetScope);
    const composition = Object.freeze(input.composition.map((entry) => createCompositionEntry(entry)));
    const predecessor = input.predecessor;
    let versionNumber = 1;
    let predecessorVersionId = null;
    let changeReason = null;
    if (predecessor) {
        validateContentPackagePredecessor(input, predecessor);
        versionNumber = predecessor.versionNumber + 1;
        predecessorVersionId = predecessor.id;
        changeReason = assertRequiredChangeReason(input.changeReason);
    }
    if (!predecessor && input.changeReason != null) {
        changeReason = assertOptionalChangeReason(input.changeReason);
    }
    return Object.freeze({
        kind: 'ContentPackageVersion',
        id: input.id,
        organizationId: input.organizationId,
        packageId: input.packageId,
        versionNumber,
        predecessorVersionId,
        lineageState: createLineageStateSet([LineageState.ACTIVE]),
        createdAt,
        createdBy: input.createdBy,
        changeReason,
        composition,
        targetScope,
        releaseNotes: normalizeOptionalText(input.releaseNotes),
        compatibilityNotes: normalizeOptionalText(input.compatibilityNotes),
    });
}
export function withAdditionalContentPackageLineageStates(version, additions) {
    return Object.freeze({
        ...version,
        lineageState: appendLineageStates(version.lineageState, additions),
    });
}
function validateContentPackagePredecessor(input, predecessor) {
    if (predecessor.organizationId !== input.organizationId) {
        throw new DomainError('CROSS_TENANT_ACCESS_DENIED', 'predecessorVersionId must stay within the same organization.');
    }
    if (predecessor.packageId !== input.packageId) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'predecessorVersionId must reference the same package lineage.');
    }
    if (predecessor.hasSuccessor === true) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Branching is prohibited in Phase 0.');
    }
}
export function freezeTargetScope(input) {
    if (input == null || typeof input !== 'object') {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'targetScope is required.');
    }
    if (input.scopeLevel === ScopeLevel.ORGANIZATION) {
        if (input.scopeTargetId != null) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Organization targetScope must not define scopeTargetId.');
        }
        return Object.freeze({
            scopeLevel: input.scopeLevel,
        });
    }
    assertNonEmptyId(input.scopeTargetId, 'targetScope.scopeTargetId');
    return Object.freeze({
        scopeLevel: input.scopeLevel,
        scopeTargetId: input.scopeTargetId ?? null,
    });
}
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', 'organizationId is required.');
    }
    return value;
}
function assertRequiredChangeReason(value) {
    const normalized = assertOptionalChangeReason(value, true);
    if (normalized == null) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'changeReason is required from version 2 onward.');
    }
    return normalized;
}
function assertOptionalChangeReason(value, required = false) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        if (required) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'changeReason is required from version 2 onward.');
        }
        return null;
    }
    return value.trim();
}
function normalizeOptionalText(value) {
    if (value == null) {
        return null;
    }
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Optional text fields must be non-empty when provided.');
    }
    return value.trim();
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
