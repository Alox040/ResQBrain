import type { VersionIncrementKind } from '../../../domain/src/release/services/ReleaseEngine';
import type {
  ContentPackageId,
  OrgId,
  UserId,
  VersionId,
} from '../../../../domain/src/shared/types';

export interface ReleaseContentPackageCommand {
  readonly packageId: ContentPackageId;
  readonly packageVersionId: VersionId;
  readonly actorUserId: UserId;
  readonly organizationId: OrgId;
  readonly versionIncrementKind: VersionIncrementKind;
  readonly rollbackSourceVersionId?: VersionId | null;
}
