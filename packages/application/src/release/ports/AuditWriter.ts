import type { AuditRecordEvent } from '../../../../domain/src/shared/audit';

export interface AuditWriter {
  record(event: AuditRecordEvent): Promise<void>;
}
