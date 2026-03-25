import { DomainError } from './DomainError';
export class AuditWriteFailure extends DomainError {
    constructor(entityId, operation, context) {
        super('AUDIT_WRITE_FAILURE', `Audit write failed for ${operation} on ${entityId}`, {
            entityId,
            operation,
            ...context,
        });
    }
}
