import { DomainError } from './DomainError';
export class DataIntegrityViolation extends DomainError {
    constructor(message, context) {
        super('DATA_INTEGRITY_VIOLATION', message, context);
    }
}
