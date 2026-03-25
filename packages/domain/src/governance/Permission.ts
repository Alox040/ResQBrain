import type { PermissionId } from '../common/ids';
import type { PermissionKey } from '../common/permissionKey';
import type { OrganizationScoped } from '../common/scope';

export interface Permission extends OrganizationScoped {
  readonly id: PermissionId;
  readonly key: PermissionKey;
  readonly description: string;
}
