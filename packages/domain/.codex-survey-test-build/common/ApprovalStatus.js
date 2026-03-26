/**
 * Compatibility surface for content/release code paths that historically imported
 * `ApprovalStatus` from `common/`. Value literals live in `content/entities/ApprovalStatus.ts`;
 * transition graph and helpers are re-exported from `lifecycle/entities/ApprovalStatus.ts`.
 */
export * from '../lifecycle/entities/ApprovalStatus';
import { ApprovalStatus as ApprovalStatusValues } from '../lifecycle/entities/ApprovalStatus';
/** Prefer {@link ApprovalStatusValues} object keys; kept for legacy iteration. */
export const APPROVAL_STATUSES = [
    ApprovalStatusValues.Draft,
    ApprovalStatusValues.InReview,
    ApprovalStatusValues.Approved,
    ApprovalStatusValues.Rejected,
    ApprovalStatusValues.Released,
    ApprovalStatusValues.Deprecated,
];
export const RELEASE_SOURCE_APPROVAL_STATUSES = [
    ApprovalStatusValues.Approved,
    ApprovalStatusValues.Released,
];
export function isReleaseSourceApprovalStatus(status) {
    return RELEASE_SOURCE_APPROVAL_STATUSES.includes(status);
}
