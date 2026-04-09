import type { OrgId, RegionId, StationId, VersionId } from '../../../../domain/src/shared/types';

export interface SearchLookupContentQuery {
  readonly organizationId: OrgId;
  readonly regionId?: RegionId | null;
  readonly stationId?: StationId | null;
  readonly releasedOnly?: boolean;
  readonly searchTerm: string;
  readonly versionId?: VersionId | null;
  readonly page?: number | null;
  readonly limit?: number | null;
}
