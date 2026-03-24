import type { ApprovalStatus } from './approval-status';

/**
 * Lifecycle label for a revision of Algorithm, Medication, Protocol, or Guideline.
 * Distinct from ApprovalStatus on content lines and ContentPackage versions.
 */
export type ContentEntityVersionStatus = 'draft' | 'approved' | 'archived';

/**
 * One immutable revision of an Algorithm, Medication, Protocol, or Guideline line.
 *
 * Scoped by `organizationId` (or `null` for global template lines) so version numbers
 * and history are independent per tenant.
 *
 * @see docs/architecture/versioning-model.md
 */
export interface ContentEntityVersion {
  id: string;
  /**
   * Same tenant partition as the parent content line (`null` for global templates).
   */
  organizationId: string | null;
  /** Stable id of the content line this revision belongs to. */
  targetId: string;
  targetKind: 'Algorithm' | 'Medication' | 'Protocol' | 'Guideline';
  /** Monotonic or display ordering within the line; interpretation is policy-defined. */
  versionNumber: number;
  status: ContentEntityVersionStatus;
  createdAt: string;
  updatedAt: string;
  createdByUserId?: string;
  changeRationale?: string;
}

/**
 * One revision of a ContentPackage line (governance + version identity).
 *
 * Scoped by `organizationId` (`null` for global template packages) so package version
 * sequences are independent per tenant or platform.
 */
export interface ContentPackageVersion {
  id: string;
  organizationId: string | null;
  targetId: string;
  targetKind: 'ContentPackage';
  /** Monotonic or display ordering within the package line. */
  versionNumber: number;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
  createdByUserId?: string;
  changeRationale?: string;
}

/**
 * Union of all version records in the domain.
 *
 * For Algorithm, Medication, Protocol, and Guideline, `currentVersionId` on the content line
 * refers to a ContentEntityVersion. For ContentPackage, `packageVersionId` refers to
 * a ContentPackageVersion.
 */
export type Version = ContentEntityVersion | ContentPackageVersion;
