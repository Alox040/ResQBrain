import type { CountyId, RegionId } from '../common/ids';
import type { OrganizationScoped } from '../common/scope';

export interface County extends OrganizationScoped {
  readonly id: CountyId;
  readonly code: string;
  readonly name: string;
  readonly regionId?: RegionId | null;
}
