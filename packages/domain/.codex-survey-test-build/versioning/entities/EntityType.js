export const EntityType = {
    Algorithm: 'Algorithm',
    Medication: 'Medication',
    Protocol: 'Protocol',
    Guideline: 'Guideline',
    ContentPackage: 'ContentPackage',
};
export const CONTENT_ENTITY_TYPES = Object.freeze([
    EntityType.Algorithm,
    EntityType.Medication,
    EntityType.Protocol,
    EntityType.Guideline,
]);
export function isContentEntityType(value) {
    return CONTENT_ENTITY_TYPES.includes(value);
}
