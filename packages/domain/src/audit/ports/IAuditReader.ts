import type { OrgId, UserId } from '../../shared/types';
import type { AuditLogEntry, AuditQueryOptions } from '../model';

export interface IAuditReader {
  findByOrganization(
    organizationId: OrgId,
    options?: AuditQueryOptions,
  ): Promise<readonly AuditLogEntry[]>;

  findByEntity(
    organizationId: OrgId,
    entityType: string,
    entityId: string,
  ): Promise<readonly AuditLogEntry[]>;

  findByActor(
    organizationId: OrgId,
    actorUserId: UserId,
  ): Promise<readonly AuditLogEntry[]>;
}
