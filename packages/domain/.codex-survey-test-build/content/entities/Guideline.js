import { DomainError } from '../../shared/errors';
import { isEditableApprovalStatus, isImmutableApprovalStatus, isLockedApprovalStatus, } from './ApprovalStatus';
import { createScopeTarget } from './ScopeTarget';
export function createGuideline(input) {
    const organizationId = assertOrgId(input.organizationId);
    return Object.freeze({
        kind: 'Guideline',
        id: assertNonEmptyId(input.id, 'id'),
        organizationId,
        entityType: 'Guideline',
        title: assertNonEmptyText(input.title, 'title'),
        guidelineCategory: normalizeOptionalText(input.guidelineCategory, 'guidelineCategory'),
        evidenceBasis: normalizeOptionalText(input.evidenceBasis, 'evidenceBasis'),
        advisory: Boolean(input.advisory),
        applicabilityScope: input.applicabilityScope
            ? createScopeTarget(input.applicabilityScope)
            : null,
        references: freezeReferences(input.references, organizationId),
        currentVersionId: assertExplicitVersionId(input.currentVersionId),
        approvalStatus: input.approvalStatus,
        effectiveDate: cloneOptionalDate(input.effectiveDate, 'effectiveDate'),
        ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
        auditTrail: freezeAuditTrail(input.auditTrail),
    });
}
export function isGuidelineEditable(guideline) {
    return isEditableApprovalStatus(guideline.approvalStatus);
}
export function isGuidelineLocked(guideline) {
    return isLockedApprovalStatus(guideline.approvalStatus);
}
export function isGuidelineImmutable(guideline) {
    return isImmutableApprovalStatus(guideline.approvalStatus);
}
export function isGuidelineStructurallyComplete(guideline) {
    return guideline.evidenceBasis != null && guideline.evidenceBasis.trim().length > 0;
}
function freezeReferences(references, organizationId) {
    return Object.freeze((references ?? []).map((reference) => {
        if (reference.organizationId !== organizationId) {
            throw new DomainError('CROSS_TENANT_ACCESS_DENIED', 'Guideline references must stay within the same organization.');
        }
        return Object.freeze({
            entityId: assertNonEmptyId(reference.entityId, 'references.entityId'),
            entityType: reference.entityType,
            organizationId: assertOrgId(reference.organizationId),
        });
    }));
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
