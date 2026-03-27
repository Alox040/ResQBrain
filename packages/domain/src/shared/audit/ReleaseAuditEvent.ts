import type { AuditEvent } from './AuditEvent';
import type { PolicyWarning } from '../types/PolicyDecision';
import type { ContentPackageId } from '../types/EntityId';
import type { UserRoleId } from '../types/RoleId';
import type { VersionId } from '../types/VersionId';

export const AuditReleaseType = {
  INITIAL: 'Initial',
  UPDATE: 'Update',
  ROLLBACK: 'Rollback',
} as const;

export type AuditReleaseType =
  (typeof AuditReleaseType)[keyof typeof AuditReleaseType];

export interface ReleaseAuditEvent extends AuditEvent {
  readonly eventType: 'release';
  readonly targetEntityType: 'ContentPackage';
  readonly targetEntityId: ContentPackageId;
  readonly releaseVersionId: VersionId;
  readonly packageVersionId: VersionId;
  readonly packageId: ContentPackageId;
  readonly releasedBy: UserRoleId;
  readonly releasedAt: string;
  readonly targetScope: Readonly<Record<string, unknown>>;
  readonly applicabilityScopes?: readonly Readonly<Record<string, unknown>>[];
  readonly excludedScopes?: readonly Readonly<Record<string, unknown>>[];
  readonly releaseType: AuditReleaseType;
  readonly compositionSnapshot: readonly Readonly<Record<string, unknown>>[];
  readonly dependencyWarnings?: readonly PolicyWarning[];
  readonly supersededReleaseId?: VersionId | null;
  readonly rollbackSourceVersionId?: VersionId | null;
}
