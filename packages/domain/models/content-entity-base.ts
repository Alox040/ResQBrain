import type { ApprovalStatus } from './approval-status';

/**
 * How an organization-owned content line relates to a global template (or upstream) line.
 * @see docs/architecture/multi-tenant-model.md
 */
export type ContentTemplateRelationship = 'override' | 'fork' | 'localizedCopy';

/**
 * Audit fields for governed content.
 * @see docs/architecture/content-model.md
 */
export interface ContentAuditFields {
  authorUserId?: string;
  reviewerUserId?: string;
  approverUserId?: string;
  changeRationale?: string;
}

/**
 * Effective window for a content revision.
 * @see docs/architecture/content-model.md
 */
export interface ContentEffectiveMetadata {
  effectiveFrom?: string;
  effectiveUntil?: string;
}

/**
 * Deprecation metadata for a content line.
 * @see docs/architecture/content-model.md
 */
export interface ContentDeprecationMetadata {
  deprecatedAt?: string;
  deprecationReason?: string;
  supersededByContentId?: string;
}

/**
 * Common attributes shared by Algorithm, Medication, Protocol, and Guideline.
 *
 * **Tenancy**
 * - `organizationId: null` — global template (platform-owned baseline), not an Organization row.
 * - `organizationId: string` — owned by that Organization, with its own version lineage.
 *
 * **Templates and overrides**
 * - Organization-owned lines may set `templateSourceContentId` / `templateRelationship` to record
 *   inheritance from a global template (override, fork, or localized copy).
 * - Global template lines must not set template linkage fields.
 *
 * @see docs/architecture/content-model.md
 * @see docs/architecture/multi-tenant-model.md
 */
export interface ContentEntityBase {
  /**
   * Owning tenant for this line. `null` denotes a global template; otherwise the Organization
   * that owns this Algorithm, Medication, Protocol, or Guideline (including overrides).
   */
  organizationId: string | null;
  /** Stable identifier for the content line (across versions), unique within its tenancy scope. */
  id: string;
  /**
   * Id of the head ContentEntityVersion for this line
   * (same `organizationId` as the line, or `null` for global templates).
   */
  currentVersionId: string;
  approvalStatus: ApprovalStatus;
  effective: ContentEffectiveMetadata;
  deprecation: ContentDeprecationMetadata;
  audit: ContentAuditFields;
  /**
   * Stable id of the global (or upstream) template line this organization row derives from.
   * Only meaningful when `organizationId` is set.
   */
  templateSourceContentId?: string;
  /** Only meaningful when `templateSourceContentId` is set. */
  templateRelationship?: ContentTemplateRelationship;
}
