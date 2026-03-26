export const SurveyInsightConfidence = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type SurveyInsightConfidence =
  (typeof SurveyInsightConfidence)[keyof typeof SurveyInsightConfidence];
