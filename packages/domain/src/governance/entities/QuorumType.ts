export const QuorumType = {
  UNANIMOUS: 'Unanimous',
  MAJORITY: 'Majority',
  SINGLE_APPROVE: 'SingleApprove',
  SINGLE_REJECT: 'SingleReject',
} as const;

export type QuorumType = (typeof QuorumType)[keyof typeof QuorumType];
