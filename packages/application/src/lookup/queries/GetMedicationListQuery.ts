import type { OrgId, RegionId, StationId, VersionId } from '../../../../domain/src/shared/types';

export interface GetMedicationListQuery {
  readonly organizationId: OrgId;
  readonly regionId?: RegionId | null;
  readonly stationId?: StationId | null;
  readonly releasedOnly?: boolean;
  readonly searchTerm?: string | null;
  readonly versionId?: VersionId | null;
  readonly page?: number | null;
  readonly limit?: number | null;
}
