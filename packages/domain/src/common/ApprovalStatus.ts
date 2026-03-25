/**
 * Compatibility surface for content/release code paths that historically imported
 * `ApprovalStatus` from `common/`. Canonical definitions (transition graph, terminals,
 * immutability helpers) live in `lifecycle/entities/ApprovalStatus.ts`.
 */
export * from '../lifecycle/entities/ApprovalStatus';

import { ApprovalStatus as ApprovalStatusValues } from '../lifecycle/entities/ApprovalStatus';
import type { ApprovalStatus } from '../lifecycle/entities/ApprovalStatus';

/** Prefer {@link ApprovalStatusValues} object keys; kept for legacy iteration. */
export const APPROVAL_STATUSES = [
  ApprovalStatusValues.DRAFT,
  ApprovalStatusValues.IN_REVIEW,
  ApprovalStatusValues.APPROVED,
  ApprovalStatusValues.REJECTED,
  ApprovalStatusValues.RELEASED,
  ApprovalStatusValues.DEPRECATED,
] as const;

export const RELEASE_SOURCE_APPROVAL_STATUSES = [
  ApprovalStatusValues.APPROVED,
  ApprovalStatusValues.RELEASED,
] as const;

export type ReleaseSourceApprovalStatus =
  (typeof RELEASE_SOURCE_APPROVAL_STATUSES)[number];

export function isReleaseSourceApprovalStatus(
  status: ApprovalStatus,
): status is ReleaseSourceApprovalStatus {
  return RELEASE_SOURCE_APPROVAL_STATUSES.includes(
    status as ReleaseSourceApprovalStatus,
  );
}
