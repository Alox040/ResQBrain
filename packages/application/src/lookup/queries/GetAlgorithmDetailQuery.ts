import type {
  AlgorithmId,
  OrgId,
  RegionId,
  StationId,
  VersionId,
} from '../../../../domain/src/shared/types';

export interface GetAlgorithmDetailQuery {
  readonly organizationId: OrgId;
  readonly entityId: AlgorithmId;
  readonly regionId?: RegionId | null;
  readonly stationId?: StationId | null;
  readonly releasedOnly?: boolean;
  readonly versionId?: VersionId | null;
}
