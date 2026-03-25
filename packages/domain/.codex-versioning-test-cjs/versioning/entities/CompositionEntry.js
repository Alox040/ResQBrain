"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompositionEntry = createCompositionEntry;
const errors_1 = require("../../shared/errors");
const EntityType_1 = require("./EntityType");
function createCompositionEntry(input) {
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
    if (!EntityType_1.CONTENT_ENTITY_TYPES.includes(value)) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'CompositionEntry.entityType must be a content entity type.', { entityType: value });
    }
    return value;
}
function assertExplicitVersionId(value) {
    const normalized = assertNonEmptyId(value, 'versionId');
    if (normalized.toLowerCase() === 'latest') {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', 'CompositionEntry.versionId must be an explicit version identifier.');
    }
    return value;
}
function assertNonEmptyId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new errors_1.DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, { field });
    }
    return value;
}
