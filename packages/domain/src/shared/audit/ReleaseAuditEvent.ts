import type { AuditEvent } from './AuditEvent';
import type { PolicyWarning } from '../types/PolicyDecision';
import type { ContentPackageId } from '../types/EntityId';
import type { UserRoleId } from '../types/RoleId';
import type { VersionId } from '../types/VersionId';

export interface ReleaseAuditEvent extends AuditEvent {
  readonly releaseVersionId: VersionId;
  readonly packageVersionId: VersionId;
  readonly packageId: ContentPackageId;
  readonly releasedBy: UserRoleId;
  readonly releasedAt: string;
  readonly targetScope: Readonly<Record<string, unknown>>;
  readonly applicabilityScopes?: readonly Readonly<Record<string, unknown>>[];
  readonly excludedScopes?: readonly Readonly<Record<string, unknown>>[];
  readonly releaseType: string;
  readonly compositionSnapshot: readonly Readonly<Record<string, unknown>>[];
  readonly dependencyWarnings?: readonly PolicyWarning[];
  readonly supersededReleaseId?: VersionId;
  readonly rollbackSourceVersionId?: VersionId;
}
