export const CONTENT_ENTITY_TYPES = [
  'Algorithm',
  'Medication',
  'Protocol',
  'Guideline',
] as const;

export type ContentEntityType = (typeof CONTENT_ENTITY_TYPES)[number];

export const PACKAGE_MEMBER_TYPES = CONTENT_ENTITY_TYPES;

export type PackageMemberType = ContentEntityType;

export const SURVEY_TARGET_ENTITY_TYPES = [
  ...CONTENT_ENTITY_TYPES,
  'Feature',
] as const;

export type SurveyTargetEntityType =
  (typeof SURVEY_TARGET_ENTITY_TYPES)[number];

export const SURVEY_INSIGHT_TYPES = [
  'demand',
  'gap',
  'issue',
  'vote',
] as const;

export type SurveyInsightType = (typeof SURVEY_INSIGHT_TYPES)[number];

export const SURVEY_CONFIDENCE_LEVELS = ['low', 'medium', 'high'] as const;

export type SurveyConfidence = (typeof SURVEY_CONFIDENCE_LEVELS)[number];
