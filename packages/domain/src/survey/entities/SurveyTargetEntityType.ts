export const SurveyInsightTargetEntityType = {
  ALGORITHM: 'Algorithm',
  MEDICATION: 'Medication',
  PROTOCOL: 'Protocol',
  GUIDELINE: 'Guideline',
  FEATURE: 'Feature',
} as const;

export type SurveyInsightTargetEntityType =
  (typeof SurveyInsightTargetEntityType)[keyof typeof SurveyInsightTargetEntityType];
