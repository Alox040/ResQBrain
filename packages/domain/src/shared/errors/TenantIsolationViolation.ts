import { DomainError } from './DomainError';

export class TenantIsolationViolation extends DomainError {
  constructor(
    message: string,
    context?: Readonly<Record<string, unknown>>,
  ) {
    super('TENANT_ISOLATION_VIOLATION', message, context);
  }
}
