import type { ApprovalStatus } from '../common/ApprovalStatus';

export type ApprovalStatusTransitionMap = Readonly<
  Record<ApprovalStatus, ReadonlyArray<ApprovalStatus>>
>;

export const APPROVAL_STATUS_TRANSITIONS: ApprovalStatusTransitionMap = {
  Draft: ['InReview'],
  InReview: ['Approved', 'Rejected'],
  Approved: ['Released'],
  Rejected: ['Draft'],
  Released: ['Deprecated'],
  Deprecated: [],
};

export function canTransitionApprovalStatus(
  from: ApprovalStatus,
  to: ApprovalStatus,
): boolean {
  return APPROVAL_STATUS_TRANSITIONS[from].includes(to);
}
