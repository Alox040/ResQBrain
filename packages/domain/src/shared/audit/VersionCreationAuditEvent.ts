import type { AuditEvent } from './AuditEvent';
import type { VersionId } from '../types/VersionId';

export interface VersionCreationAuditEvent extends AuditEvent {
  readonly versionId: VersionId;
  readonly entityId: string;
  readonly entityType: string;
  readonly versionNumber: number;
  readonly predecessorVersionId?: VersionId;
  readonly changeReason?: string;
  readonly snapshot: Readonly<Record<string, unknown>>;
}
