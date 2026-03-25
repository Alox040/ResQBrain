import { DataIntegrityViolation } from '../../shared/errors';
import { assertSameOrg, } from './TenantScopeValidator';
export function validateIntraOrgRef(source, target) {
    return assertSameOrg(source, target);
}
export function validateOptionalIntraOrgRef(source, target) {
    if (!target) {
        return null;
    }
    return validateIntraOrgRef(source, target);
}
export function validateHierarchyEdge(parent, child) {
    return assertSameOrg(parent, child);
}
export function assertNoImplicitTenantDerivation(organizationId, fallbackContext) {
    if (typeof organizationId === 'string' && organizationId.trim().length > 0) {
        return;
    }
    throw new DataIntegrityViolation('organizationId must be supplied explicitly and cannot be derived from fallback context.', {
        fallbackContext: fallbackContext ?? null,
    });
}
