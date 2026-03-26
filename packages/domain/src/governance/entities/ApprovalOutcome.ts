export const ApprovalOutcome = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  REQUEST_CHANGES: 'RequestChanges',
  ABSTAINED: 'Abstained',
} as const;

export type ApprovalOutcome =
  (typeof ApprovalOutcome)[keyof typeof ApprovalOutcome];
