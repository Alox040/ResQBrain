import type { OrgId } from '../types/OrgId';
import type { UserId } from '../types/UserId';
import type { UserRoleId } from '../types/RoleId';
import type { AuditOperation } from './AuditOperation';

export interface AuditEvent {
  readonly id: string;
  readonly organizationId: OrgId;
  readonly timestamp: string;
  readonly actorUserId: UserId;
  readonly actorRoleId: UserRoleId;
  readonly operation: AuditOperation;
}
