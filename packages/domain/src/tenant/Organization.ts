import type {
  CountyId,
  OrganizationId,
  RegionId,
  StationId,
} from '../common/ids';

export interface Organization {
  readonly id: OrganizationId;
  readonly slug: string;
  readonly name: string;
  readonly regionIds: ReadonlyArray<RegionId>;
  readonly countyIds: ReadonlyArray<CountyId>;
  readonly stationIds: ReadonlyArray<StationId>;
  readonly active: boolean;
}
