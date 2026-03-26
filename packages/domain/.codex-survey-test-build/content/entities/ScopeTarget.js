import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';
export function createScopeTarget(input) {
    if (input == null || typeof input !== 'object') {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'ScopeTarget is required.');
    }
    if (input.scopeLevel === ScopeLevel.ORGANIZATION) {
        if (input.scopeTargetId != null) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Organization scope must not define scopeTargetId.');
        }
        return Object.freeze({
            scopeLevel: ScopeLevel.ORGANIZATION,
        });
    }
    const scopeLevel = input.scopeLevel;
    if (scopeLevel !== ScopeLevel.REGION &&
        scopeLevel !== ScopeLevel.COUNTY &&
        scopeLevel !== ScopeLevel.STATION) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'ScopeTarget.scopeLevel is invalid.', { scopeLevel });
    }
    const scopedInput = input;
    return Object.freeze({
        scopeLevel: scopedInput.scopeLevel,
        scopeTargetId: assertNonEmptyId(scopedInput.scopeTargetId, 'scopeTargetId'),
    });
}
export function createScopeTargets(entries) {
    return Object.freeze((entries ?? []).map((entry) => createScopeTarget(entry)));
}
function assertNonEmptyId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, { field });
    }
    return value;
}
