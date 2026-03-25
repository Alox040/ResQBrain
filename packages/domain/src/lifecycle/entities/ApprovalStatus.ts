/**
 * Canonical `ApprovalStatus` value type and transition graph for the domain.
 * `common/ApprovalStatus` re-exports this module for legacy import paths.
 */
export const ApprovalStatus = {
  DRAFT: 'Draft',
  IN_REVIEW: 'InReview',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  RELEASED: 'Released',
  DEPRECATED: 'Deprecated',
} as const;

export type ApprovalStatus =
  (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

export type ApprovalStatusTransitionMap = Readonly<
  Record<ApprovalStatus, readonly ApprovalStatus[]>
>;

export const APPROVAL_STATUS_TRANSITIONS: ApprovalStatusTransitionMap =
  Object.freeze({
    [ApprovalStatus.DRAFT]: Object.freeze([ApprovalStatus.IN_REVIEW]),
    [ApprovalStatus.IN_REVIEW]: Object.freeze([
      ApprovalStatus.APPROVED,
      ApprovalStatus.REJECTED,
    ]),
    [ApprovalStatus.APPROVED]: Object.freeze([
      ApprovalStatus.IN_REVIEW,
      ApprovalStatus.RELEASED,
    ]),
    [ApprovalStatus.REJECTED]: Object.freeze([]),
    [ApprovalStatus.RELEASED]: Object.freeze([ApprovalStatus.DEPRECATED]),
    [ApprovalStatus.DEPRECATED]: Object.freeze([]),
  });

export const EDITABLE_APPROVAL_STATUSES = Object.freeze([
  ApprovalStatus.DRAFT,
] as const);

export const LOCKED_APPROVAL_STATUSES = Object.freeze([
  ApprovalStatus.IN_REVIEW,
  ApprovalStatus.APPROVED,
  ApprovalStatus.REJECTED,
  ApprovalStatus.RELEASED,
  ApprovalStatus.DEPRECATED,
] as const);

export const IMMUTABLE_APPROVAL_STATUSES = Object.freeze([
  ApprovalStatus.RELEASED,
  ApprovalStatus.DEPRECATED,
] as const);

export const TERMINAL_APPROVAL_STATUSES = Object.freeze([
  ApprovalStatus.REJECTED,
  ApprovalStatus.DEPRECATED,
] as const);

export function canTransitionApprovalStatus(
  from: ApprovalStatus,
  to: ApprovalStatus,
): boolean {
  return APPROVAL_STATUS_TRANSITIONS[from].includes(to);
}

export function isEditableApprovalStatus(
  status: ApprovalStatus,
): status is (typeof EDITABLE_APPROVAL_STATUSES)[number] {
  return EDITABLE_APPROVAL_STATUSES.includes(
    status as (typeof EDITABLE_APPROVAL_STATUSES)[number],
  );
}

export function isLockedApprovalStatus(
  status: ApprovalStatus,
): status is (typeof LOCKED_APPROVAL_STATUSES)[number] {
  return LOCKED_APPROVAL_STATUSES.includes(
    status as (typeof LOCKED_APPROVAL_STATUSES)[number],
  );
}

export function isImmutableApprovalStatus(
  status: ApprovalStatus,
): status is (typeof IMMUTABLE_APPROVAL_STATUSES)[number] {
  return IMMUTABLE_APPROVAL_STATUSES.includes(
    status as (typeof IMMUTABLE_APPROVAL_STATUSES)[number],
  );
}

export function isTerminalApprovalStatus(
  status: ApprovalStatus,
): status is (typeof TERMINAL_APPROVAL_STATUSES)[number] {
  return TERMINAL_APPROVAL_STATUSES.includes(
    status as (typeof TERMINAL_APPROVAL_STATUSES)[number],
  );
}
