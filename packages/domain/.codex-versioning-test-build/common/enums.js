export const CONTENT_ENTITY_TYPES = [
    'Algorithm',
    'Medication',
    'Protocol',
    'Guideline',
];
export const PACKAGE_MEMBER_TYPES = CONTENT_ENTITY_TYPES;
export const SURVEY_TARGET_ENTITY_TYPES = [
    ...CONTENT_ENTITY_TYPES,
    'Feature',
];
export const SURVEY_INSIGHT_TYPES = [
    'demand',
    'gap',
    'issue',
    'vote',
];
export const SURVEY_CONFIDENCE_LEVELS = ['low', 'medium', 'high'];
