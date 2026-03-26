import { DomainError } from '../../shared/errors';
import { appendLineageStates, createLineageStateSet, LineageState, } from './LineageState';
import { CONTENT_ENTITY_TYPES, } from './EntityType';
export function createContentEntityVersion(input) {
    assertNonEmptyId(input.id, 'id');
    assertOrgId(input.organizationId);
    assertNonEmptyId(input.entityId, 'entityId');
    assertEntityType(input.entityType);
    const createdAt = cloneDate(input.createdAt, 'createdAt');
    assertNonEmptyId(input.createdBy, 'createdBy');
    const snapshot = deepFreezeSnapshot(input.snapshot);
    const predecessor = input.predecessor;
    let versionNumber = 1;
    let predecessorVersionId = null;
    let changeReason = null;
    if (predecessor) {
        validateContentEntityPredecessor(input, predecessor);
        versionNumber = predecessor.versionNumber + 1;
        predecessorVersionId = predecessor.id;
        changeReason = assertRequiredChangeReason(input.changeReason);
    }
    if (!predecessor && input.changeReason != null) {
        changeReason = assertOptionalChangeReason(input.changeReason);
    }
    return Object.freeze({
        kind: 'ContentEntityVersion',
        id: input.id,
        organizationId: input.organizationId,
        entityId: input.entityId,
        entityType: input.entityType,
        versionNumber,
        predecessorVersionId,
        lineageState: createLineageStateSet([LineageState.ACTIVE]),
        createdAt,
        createdBy: input.createdBy,
        changeReason,
        snapshot,
    });
}
export function withAdditionalContentEntityLineageStates(version, additions) {
    return Object.freeze({
        ...version,
        lineageState: appendLineageStates(version.lineageState, additions),
    });
}
function validateContentEntityPredecessor(input, predecessor) {
    if (predecessor.organizationId !== input.organizationId) {
        throw new DomainError('CROSS_TENANT_ACCESS_DENIED', 'predecessorVersionId must stay within the same organization.');
    }
    if (predecessor.entityId !== input.entityId) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'predecessorVersionId must reference the same entity lineage.');
    }
    if (predecessor.entityType !== input.entityType) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'predecessorVersionId must reference the same entity type.');
    }
    if (predecessor.hasSuccessor === true) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Branching is prohibited in Phase 0.');
    }
}
function assertEntityType(value) {
    if (!CONTENT_ENTITY_TYPES.includes(value)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'entityType must be a content entity type.', { entityType: value });
    }
    return value;
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
function deepFreezeSnapshot(snapshot) {
    if (snapshot === null || Array.isArray(snapshot) || typeof snapshot !== 'object') {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'snapshot must be a plain object.');
    }
    return deepFreezeValue(structuredClone(snapshot));
}
function deepFreezeValue(value) {
    if (Array.isArray(value)) {
        for (const item of value) {
            deepFreezeValue(item);
        }
        return Object.freeze(value);
    }
    if (value instanceof Date) {
        return Object.freeze(new Date(value.getTime()));
    }
    if (value !== null && typeof value === 'object') {
        for (const propertyValue of Object.values(value)) {
            deepFreezeValue(propertyValue);
        }
        return Object.freeze(value);
    }
    return value;
}
