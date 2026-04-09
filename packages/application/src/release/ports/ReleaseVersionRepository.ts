import type { ReleaseVersion } from '../../../../domain/src/versioning/entities';
import type { ContentPackageId, OrgId } from '../../../../domain/src/shared/types';

export interface ReleaseVersionRepository {
  findActive(
    packageId: ContentPackageId,
    organizationId: OrgId,
  ): Promise<ReleaseVersion | null>;

  save(release: ReleaseVersion): Promise<void>;
}
