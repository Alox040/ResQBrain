export const SurveyInsightKind = {
  DEMAND: 'demand',
  GAP: 'gap',
  ISSUE: 'issue',
  VOTE: 'vote',
} as const;

export type SurveyInsightKind =
  (typeof SurveyInsightKind)[keyof typeof SurveyInsightKind];
