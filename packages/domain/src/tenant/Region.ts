import type { CountyId, RegionId } from '../common/ids';
import type { OrganizationScoped } from '../common/scope';

export interface Region extends OrganizationScoped {
  readonly id: RegionId;
  readonly code: string;
  readonly name: string;
  readonly countyIds: ReadonlyArray<CountyId>;
}
