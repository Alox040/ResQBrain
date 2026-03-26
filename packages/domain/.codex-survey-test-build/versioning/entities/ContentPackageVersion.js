import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';
import { createCompositionEntry } from './CompositionEntry';
import { createContentPackageDependencyNote, ContentPackageDependencyType, } from './ContentPackageDependency';
import { appendLineageStates, createLineageStateSet, LineageState, } from './LineageState';
export function createContentPackageVersion(input) {
    assertNonEmptyId(input.id, 'id');
    assertOrgId(input.organizationId);
    assertNonEmptyId(input.packageId, 'packageId');
    const createdAt = cloneDate(input.createdAt, 'createdAt');
    assertNonEmptyId(input.createdBy, 'createdBy');
    const targetScope = freezeTargetScope(input.targetScope);
    const applicabilityScopes = freezeTargetScopes(input.applicabilityScopes);
    const excludedScopes = freezeTargetScopes(input.excludedScopes);
    const composition = Object.freeze(input.composition.map((entry) => createCompositionEntry(entry)));
    validateUniqueComposition(composition);
    const predecessor = input.predecessor;
    const dependencyNotes = Object.freeze((input.dependencyNotes ?? []).map((note) => createContentPackageDependencyNote(note)));
    validateDependencyNotes(dependencyNotes);
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
        applicabilityScopes,
        excludedScopes,
        releaseNotes: normalizeOptionalText(input.releaseNotes),
        compatibilityNotes: normalizeOptionalText(input.compatibilityNotes),
        dependencyNotes,
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
function freezeTargetScopes(inputs) {
    return Object.freeze((inputs ?? []).map((input) => freezeTargetScope(input)));
}
function validateUniqueComposition(composition) {
    const seen = new Map();
    for (const entry of composition) {
        const key = `${entry.entityType}:${entry.entityId}`;
        const duplicate = seen.get(key);
        if (duplicate) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'A ContentPackageVersion cannot contain multiple versions of the same content entity.', {
                entityType: entry.entityType,
                entityId: entry.entityId,
                versionIds: [duplicate.versionId, entry.versionId],
            });
        }
        seen.set(key, entry);
    }
}
function validateDependencyNotes(dependencyNotes) {
    const exactKeys = new Map();
    const targetRelations = new Map();
    for (const note of dependencyNotes) {
        const exactKey = [
            note.dependencyType,
            note.targetEntityType,
            note.targetEntityId,
            note.targetVersionId ?? '*',
        ].join(':');
        const targetKey = [
            note.targetEntityType,
            note.targetEntityId,
            note.targetVersionId ?? '*',
        ].join(':');
        const existing = exactKeys.get(exactKey);
        if (existing) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Duplicate dependencyNotes entries are not allowed.', {
                dependencyType: note.dependencyType,
                targetEntityType: note.targetEntityType,
                targetEntityId: note.targetEntityId,
                targetVersionId: note.targetVersionId,
            });
        }
        const relations = targetRelations.get(targetKey) ?? new Set();
        relations.add(note.dependencyType);
        targetRelations.set(targetKey, relations);
        exactKeys.set(exactKey, note);
        if (relations.has(ContentPackageDependencyType.REQUIRES) &&
            relations.has(ContentPackageDependencyType.CONFLICTS)) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'dependencyNotes cannot both require and conflict with the same target.', {
                targetEntityType: note.targetEntityType,
                targetEntityId: note.targetEntityId,
                targetVersionId: note.targetVersionId,
            });
        }
    }
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
