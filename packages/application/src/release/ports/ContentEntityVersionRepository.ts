import type { ContentPackageVersion } from '../../../../domain/src/versioning/entities';
import type { OrgId, VersionId } from '../../../../domain/src/shared/types';

export interface ContentEntityVersionRepository {
  findById(
    versionId: VersionId,
    organizationId: OrgId,
  ): Promise<ContentPackageVersion | null>;

  markAsReleased(
    versionId: VersionId,
    organizationId: OrgId,
  ): Promise<void>;
}
