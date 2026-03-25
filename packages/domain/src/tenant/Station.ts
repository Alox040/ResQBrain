import type { CountyId, RegionId, StationId } from '../common/ids';
import type { OrganizationScoped } from '../common/scope';

export interface Station extends OrganizationScoped {
  readonly id: StationId;
  readonly code: string;
  readonly name: string;
  readonly regionId?: RegionId | null;
  readonly countyId?: CountyId | null;
}
