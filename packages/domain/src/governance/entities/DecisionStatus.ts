export const DecisionStatus = {
  PENDING: 'Pending',
  SUBMITTED: 'Submitted',
  SUPERSEDED: 'Superseded',
} as const;

export type DecisionStatus = (typeof DecisionStatus)[keyof typeof DecisionStatus];
