/**
 * Lifecycle state for content and packages.
 * @see docs/architecture/versioning-model.md
 */
export type ApprovalStatus =
  | 'Draft'
  | 'InReview'
  | 'Approved'
  | 'Rejected'
  | 'Released'
  | 'Deprecated';
