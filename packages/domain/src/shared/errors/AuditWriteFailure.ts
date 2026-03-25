import { DomainError } from './DomainError';

export class AuditWriteFailure extends DomainError {
  constructor(
    entityId: string,
    operation: string,
    context?: Readonly<Record<string, unknown>>,
  ) {
    super(
      'AUDIT_WRITE_FAILURE',
      `Audit write failed for ${operation} on ${entityId}`,
      {
        entityId,
        operation,
        ...context,
      },
    );
  }
}
