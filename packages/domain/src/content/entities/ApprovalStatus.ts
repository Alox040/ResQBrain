/**
 * Layer 3 — `ApprovalStatus` value type embedded on all content entities.
 * Transition authority and graphs live in `lifecycle/entities/ApprovalStatus.ts`.
 */

export const ApprovalStatus = {
  Draft: 'Draft',
  InReview: 'InReview',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Released: 'Released',
  Deprecated: 'Deprecated',
} as const;

export type ApprovalStatus =
  (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

const EDITABLE = new Set<ApprovalStatus>([ApprovalStatus.Draft]);

const IMMUTABLE = new Set<ApprovalStatus>([
  ApprovalStatus.Released,
  ApprovalStatus.Deprecated,
]);

const TERMINAL = new Set<ApprovalStatus>([
  ApprovalStatus.Rejected,
  ApprovalStatus.Deprecated,
]);

/** Draft only — structural edit window (no policy authority). */
export function isEditableApprovalStatus(status: ApprovalStatus): boolean {
  return EDITABLE.has(status);
}

/** Not Draft — locked for ordinary authoring (structural, not governance). */
export function isLockedApprovalStatus(status: ApprovalStatus): boolean {
  return !isEditableApprovalStatus(status);
}

export function isImmutableApprovalStatus(status: ApprovalStatus): boolean {
  return IMMUTABLE.has(status);
}

export function isTerminalApprovalStatus(status: ApprovalStatus): boolean {
  return TERMINAL.has(status);
}
