import { DomainError } from '../../shared/errors';
import { CONTENT_ENTITY_TYPES } from './EntityType';
export function createCompositionEntry(input) {
    assertNonEmptyId(input.entityId, 'entityId');
    assertExplicitVersionId(input.versionId);
    assertEntityType(input.entityType);
    return Object.freeze({
        entityId: input.entityId,
        versionId: input.versionId,
        entityType: input.entityType,
    });
}
function assertEntityType(value) {
    if (!CONTENT_ENTITY_TYPES.includes(value)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'CompositionEntry.entityType must be a content entity type.', { entityType: value });
    }
    return value;
}
function assertExplicitVersionId(value) {
    const normalized = assertNonEmptyId(value, 'versionId');
    if (normalized.toLowerCase() === 'latest') {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'CompositionEntry.versionId must be an explicit version identifier.');
    }
    return value;
}
function assertNonEmptyId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, { field });
    }
    return value;
}
