import type { ContentPackage } from '../../../../domain/src/content/entities';
import type { ContentPackageId, OrgId } from '../../../../domain/src/shared/types';

export interface ContentPackageRepository {
  findById(
    packageId: ContentPackageId,
    organizationId: OrgId,
  ): Promise<ContentPackage | null>;

  markAsReleased(
    packageId: ContentPackageId,
    organizationId: OrgId,
  ): Promise<void>;
}
