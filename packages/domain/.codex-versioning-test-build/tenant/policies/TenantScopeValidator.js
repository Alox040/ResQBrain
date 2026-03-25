import { DomainError, TenantIsolationViolation } from '../../shared/errors';
import { OrganizationStatus } from '../entities';
export function validateOrgIdPresent(organizationId) {
    if (typeof organizationId !== 'string' || organizationId.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', 'organizationId must be provided explicitly for every tenant-scoped operation.');
    }
    return organizationId;
}
export function assertSameOrg(left, right) {
    const leftOrgId = validateOrgIdPresent(left.organizationId);
    const rightOrgId = validateOrgIdPresent(right.organizationId);
    if (leftOrgId !== rightOrgId) {
        throw new TenantIsolationViolation('Cross-organization access is not permitted.', {
            leftOrganizationId: leftOrgId,
            rightOrganizationId: rightOrgId,
        });
    }
    return [left, right];
}
export function assertOrgActive(organization) {
    const organizationId = validateOrgIdPresent(organization.id);
    if (organization.status !== OrganizationStatus.ACTIVE) {
        throw new DomainError('ORGANIZATION_NOT_ACTIVE', 'Only active organizations may perform write operations.', {
            organizationId,
            status: organization.status,
        });
    }
    return organization;
}
