import { DomainError } from '../../shared/errors';
import { CONTENT_ENTITY_TYPES, EntityType, } from './EntityType';
export const ContentPackageDependencyType = {
    REQUIRES: 'Requires',
    SUPERSEDES: 'Supersedes',
    CONFLICTS: 'Conflicts',
    RECOMMENDS_ALONGSIDE: 'RecommendsAlongside',
};
export const ContentPackageDependencySeverity = {
    WARNING: 'Warning',
    HARD_BLOCK: 'HardBlock',
};
const DEPENDENCY_TYPES = Object.freeze(Object.values(ContentPackageDependencyType));
const DEPENDENCY_SEVERITIES = Object.freeze(Object.values(ContentPackageDependencySeverity));
export function createContentPackageDependencyNote(input) {
    return Object.freeze({
        dependencyType: assertDependencyType(input.dependencyType),
        targetEntityType: assertTargetEntityType(input.targetEntityType),
        targetEntityId: assertNonEmptyId(input.targetEntityId, 'targetEntityId'),
        targetVersionId: normalizeOptionalVersionId(input.targetVersionId),
        severity: assertSeverity(input.severity),
        rationale: assertNonEmptyText(input.rationale, 'rationale'),
    });
}
function assertDependencyType(value) {
    if (!DEPENDENCY_TYPES.includes(value)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'dependencyType is invalid.', { dependencyType: value });
    }
    return value;
}
function assertTargetEntityType(value) {
    if (value === EntityType.ContentPackage) {
        return value;
    }
    if (!CONTENT_ENTITY_TYPES.includes(value)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'targetEntityType is invalid.', { targetEntityType: value });
    }
    return value;
}
function normalizeOptionalVersionId(value) {
    if (value == null) {
        return null;
    }
    const normalized = assertNonEmptyId(value, 'targetVersionId');
    if (normalized.toLowerCase() === 'latest') {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'targetVersionId must be an explicit version identifier.', { targetVersionId: value });
    }
    return normalized;
}
function assertSeverity(value) {
    if (!DEPENDENCY_SEVERITIES.includes(value)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'severity is invalid.', { severity: value });
    }
    return value;
}
function assertNonEmptyText(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, { field });
    }
    return value.trim();
}
function assertNonEmptyId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, { field });
    }
    return value;
}
