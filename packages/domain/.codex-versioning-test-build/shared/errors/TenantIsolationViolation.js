import { DomainError } from './DomainError';
export class TenantIsolationViolation extends DomainError {
    constructor(message, context) {
        super('TENANT_ISOLATION_VIOLATION', message, context);
    }
}
