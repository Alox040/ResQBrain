import type {
  MedicationId,
  OrgId,
  RegionId,
  StationId,
  VersionId,
} from '../../../../domain/src/shared/types';

export interface GetMedicationDetailQuery {
  readonly organizationId: OrgId;
  readonly entityId: MedicationId;
  readonly regionId?: RegionId | null;
  readonly stationId?: StationId | null;
  readonly releasedOnly?: boolean;
  readonly versionId?: VersionId | null;
}
