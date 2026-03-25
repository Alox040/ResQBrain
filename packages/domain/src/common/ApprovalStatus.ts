export const APPROVAL_STATUSES = [
  'Draft',
  'InReview',
  'Approved',
  'Rejected',
  'Released',
  'Deprecated',
] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const IMMUTABLE_APPROVAL_STATUSES = [
  'Released',
  'Deprecated',
] as const;

export const TERMINAL_APPROVAL_STATUSES = ['Deprecated'] as const;

export const RELEASE_SOURCE_APPROVAL_STATUSES = [
  'Approved',
  'Released',
] as const;

export type ReleaseSourceApprovalStatus =
  (typeof RELEASE_SOURCE_APPROVAL_STATUSES)[number];

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

export function isReleaseSourceApprovalStatus(
  status: ApprovalStatus,
): status is ReleaseSourceApprovalStatus {
  return RELEASE_SOURCE_APPROVAL_STATUSES.includes(
    status as ReleaseSourceApprovalStatus,
  );
}
