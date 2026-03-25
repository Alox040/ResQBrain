export const EntityType = {
  Algorithm: 'Algorithm',
  Medication: 'Medication',
  Protocol: 'Protocol',
  Guideline: 'Guideline',
  ContentPackage: 'ContentPackage',
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export const CONTENT_ENTITY_TYPES = Object.freeze([
  EntityType.Algorithm,
  EntityType.Medication,
  EntityType.Protocol,
  EntityType.Guideline,
] as const);

export type ContentEntityType = (typeof CONTENT_ENTITY_TYPES)[number];

export function isContentEntityType(value: EntityType): value is ContentEntityType {
  return CONTENT_ENTITY_TYPES.includes(value as ContentEntityType);
}
