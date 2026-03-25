import { DomainError } from './DomainError';

export class DataIntegrityViolation extends DomainError {
  constructor(
    message: string,
    context?: Readonly<Record<string, unknown>>,
  ) {
    super('DATA_INTEGRITY_VIOLATION', message, context);
  }
}
