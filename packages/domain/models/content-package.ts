import type { ApprovalStatus } from './approval-status';
import type { ContentAuditFields } from './content-entity-base';

/**
 * Reference to a specific revision of a content line included in a package.
 * @see docs/architecture/domain-model.md
 */
export interface ContentPackageMemberRef {
  contentId: string;
  versionId: string;
}

/**
 * Whether a package is currently activatable in scope (operational on/off).
 */
export type ContentPackageActivationState = 'active' | 'inactive';

/**
 * Activation and deactivation timestamps for audit and rollout control.
 */
export interface ContentPackageActivation {
  state: ContentPackageActivationState;
  /** When the package last entered the active state. */
  activatedAt?: string;
  /** When the package last entered the inactive state. */
  deactivatedAt?: string;
}

/**
 * Versioned collection of Algorithms, Medications, Protocols, and Guidelines.
 *
 * **Tenancy**
 * - `organizationId: string` — owned by that Organization (releases and governance in-tenant).
 * - `organizationId: null` — global template package (platform baseline); region assignments
 *   must be empty until contextualized under an Organization.
 *
 * **Contents** — Member arrays hold ContentPackageMemberRef entries for Algorithms, Medications, Protocols, and Guidelines.
 *
 * **Versioning** — `packageVersionId` points to the head ContentPackageVersion for this line.
 *
 * **Regions** — `assignedRegionIds` limits applicability to those Region ids (must belong to
 * the same Organization when `organizationId` is set). Empty means no region restriction
 * (whole-organization or global applicability per policy).
 *
 * @see docs/architecture/domain-model.md
 * @see docs/architecture/content-model.md
 * @see docs/architecture/multi-tenant-model.md
 */
export interface ContentPackage {
  /**
   * Owning tenant, or `null` for a global template package.
   */
  organizationId: string | null;
  /** Stable id for the package line across package versions. */
  id: string;
  /** Id of the head ContentPackageVersion for this line. */
  packageVersionId: string;
  approvalStatus: ApprovalStatus;
  activation: ContentPackageActivation;
  /**
   * Region ids where this package applies. Empty = not restricted to specific regions.
   * When `organizationId` is set, each id must reference a Region for that Organization.
   */
  assignedRegionIds: string[];
  targetAudience?: string;
  scopeNotes?: string;
  includedAlgorithms: ContentPackageMemberRef[];
  includedMedications: ContentPackageMemberRef[];
  includedProtocols: ContentPackageMemberRef[];
  includedGuidelines: ContentPackageMemberRef[];
  compatibilityNotes?: string;
  dependencyNotes?: string;
  releaseNotes?: string;
  audit: ContentAuditFields;
}
