import type { AuditableEvent, AuditRecordEvent } from '../shared/audit';

import { DomainError } from '../shared/errors';

/**
 * Binds the system-issued persist timestamp (HC-7). Call from `IAuditWriter` adapters only.
 */
export function stampAuditEventForPersistence(
  event: AuditRecordEvent,
  timestampUtcIso: string,
): AuditableEvent {
  if (typeof timestampUtcIso !== 'string' || timestampUtcIso.trim().length === 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Audit persistence timestamp must be a non-empty ISO-8601 string.',
      { field: 'timestampUtcIso' },
    );
  }

  if (Number.isNaN(Date.parse(timestampUtcIso.trim()))) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'Audit persistence timestamp must be parseable as a date.',
      { field: 'timestampUtcIso' },
    );
  }

  return { ...event, timestamp: timestampUtcIso.trim() } as AuditableEvent;
}
