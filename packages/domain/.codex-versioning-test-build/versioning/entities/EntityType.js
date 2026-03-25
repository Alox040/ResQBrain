export const EntityType = {
    ALGORITHM: 'Algorithm',
    MEDICATION: 'Medication',
    PROTOCOL: 'Protocol',
    GUIDELINE: 'Guideline',
    CONTENT_PACKAGE: 'ContentPackage',
};
export const CONTENT_ENTITY_TYPES = Object.freeze([
    EntityType.ALGORITHM,
    EntityType.MEDICATION,
    EntityType.PROTOCOL,
    EntityType.GUIDELINE,
]);
export function isContentEntityType(value) {
    return CONTENT_ENTITY_TYPES.includes(value);
}
