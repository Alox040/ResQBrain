import { DomainError } from '../../shared/errors';
import { isEditableApprovalStatus, isImmutableApprovalStatus, isLockedApprovalStatus, } from './ApprovalStatus';
import { createScopeTarget, createScopeTargets, } from './ScopeTarget';
export function createContentPackage(input) {
    return Object.freeze({
        kind: 'ContentPackage',
        id: assertNonEmptyId(input.id, 'id'),
        organizationId: assertOrgId(input.organizationId),
        entityType: 'ContentPackage',
        title: assertNonEmptyText(input.title, 'title'),
        label: normalizeOptionalText(input.label, 'label'),
        description: normalizeOptionalText(input.description, 'description'),
        targetAudience: freezeTextArray(input.targetAudience, 'targetAudience'),
        targetScope: createScopeTarget(input.targetScope),
        applicabilityScopes: createScopeTargets(input.applicabilityScopes),
        excludedScopes: createScopeTargets(input.excludedScopes),
        approvalStatus: input.approvalStatus,
        currentVersionId: assertExplicitVersionId(input.currentVersionId),
        createdAt: cloneDate(input.createdAt, 'createdAt'),
        createdBy: assertNonEmptyId(input.createdBy, 'createdBy'),
        ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
        auditTrail: freezeAuditTrail(input.auditTrail),
    });
}
export function isContentPackageEditable(contentPackage) {
    return isEditableApprovalStatus(contentPackage.approvalStatus);
}
export function isContentPackageLocked(contentPackage) {
    return isLockedApprovalStatus(contentPackage.approvalStatus);
}
export function isContentPackageImmutable(contentPackage) {
    return isImmutableApprovalStatus(contentPackage.approvalStatus);
}
function freezeAuditTrail(entries) {
    return Object.freeze((entries ?? []).map((entry) => Object.freeze({
        recordedAt: cloneDate(entry.recordedAt, 'auditTrail.recordedAt'),
        actorRoleId: assertNonEmptyId(entry.actorRoleId, 'auditTrail.actorRoleId'),
        operation: assertNonEmptyText(entry.operation, 'auditTrail.operation'),
        rationale: assertNonEmptyText(entry.rationale, 'auditTrail.rationale'),
    })));
}
function normalizeDeprecation(dateValue, reasonValue) {
    const deprecationDate = cloneOptionalDate(dateValue, 'deprecationDate');
    const deprecationReason = normalizeOptionalText(reasonValue, 'deprecationReason');
    if ((deprecationDate == null) !== (deprecationReason == null)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'deprecationDate and deprecationReason must be provided together.');
    }
    return { deprecationDate, deprecationReason };
}
function assertExplicitVersionId(value) {
    const versionId = assertNonEmptyId(value, 'currentVersionId');
    if (versionId.toLowerCase() === 'latest') {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'currentVersionId must be an explicit version identifier.');
    }
    return versionId;
}
function freezeTextArray(values, field) {
    return Object.freeze((values ?? []).map((value) => assertNonEmptyText(value, field)));
}
function normalizeOptionalText(value, field) {
    if (value == null) {
        return null;
    }
    return assertNonEmptyText(value, field);
}
function assertNonEmptyText(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, { field });
    }
    return value.trim();
}
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', 'organizationId is required.');
    }
    return value;
}
function assertNonEmptyId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, { field });
    }
    return value;
}
function cloneOptionalDate(value, field) {
    if (value == null) {
        return null;
    }
    return cloneDate(value, field);
}
function cloneDate(value, field) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a valid Date.`, { field });
    }
    return new Date(value.getTime());
}
