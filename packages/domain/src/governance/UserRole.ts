import type { UserRoleId } from '../common/ids';
import type { PermissionKey } from '../common/permissionKey';
import type { OrganizationScoped } from '../common/scope';
import type { UserRoleName } from '../common/userRoleName';

export interface UserRole extends OrganizationScoped {
  readonly id: UserRoleId;
  readonly name: UserRoleName;
  readonly permissionKeys: ReadonlyArray<PermissionKey>;
  readonly immutable: boolean;
}
