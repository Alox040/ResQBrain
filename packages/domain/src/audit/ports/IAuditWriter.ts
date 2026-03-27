import type { AuditRecordEvent } from '../../shared/audit';

export type { AuditRecordEvent } from '../../shared/audit';

/**
 * Append-only audit sink. No update/delete operations (HC-3).
 * On failure, implementations throw `AuditWriteFailure` (HC-8).
 */
export interface IAuditWriter {
  record(event: AuditRecordEvent): Promise<void>;
}
