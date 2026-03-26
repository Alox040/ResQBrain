import { DomainError } from '../../shared/errors';
import { isEditableApprovalStatus, isImmutableApprovalStatus, isLockedApprovalStatus, } from './ApprovalStatus';
import { createScopeTarget } from './ScopeTarget';
export function createProtocol(input) {
    const organizationId = assertOrgId(input.organizationId);
    return Object.freeze({
        kind: 'Protocol',
        id: assertNonEmptyId(input.id, 'id'),
        organizationId,
        entityType: 'Protocol',
        title: assertNonEmptyText(input.title, 'title'),
        procedureCategory: normalizeOptionalText(input.procedureCategory, 'procedureCategory'),
        regulatoryBasis: normalizeOptionalText(input.regulatoryBasis, 'regulatoryBasis'),
        applicabilityScope: input.applicabilityScope
            ? createScopeTarget(input.applicabilityScope)
            : null,
        requiredEquipment: freezeTextArray(input.requiredEquipment, 'requiredEquipment'),
        references: freezeReferences(input.references, organizationId),
        currentVersionId: assertExplicitVersionId(input.currentVersionId),
        approvalStatus: input.approvalStatus,
        effectiveDate: cloneOptionalDate(input.effectiveDate, 'effectiveDate'),
        ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
        auditTrail: freezeAuditTrail(input.auditTrail),
    });
}
export function isProtocolEditable(protocol) {
    return isEditableApprovalStatus(protocol.approvalStatus);
}
export function isProtocolLocked(protocol) {
    return isLockedApprovalStatus(protocol.approvalStatus);
}
export function isProtocolImmutable(protocol) {
    return isImmutableApprovalStatus(protocol.approvalStatus);
}
export function isProtocolStructurallyComplete(protocol) {
    return protocol.regulatoryBasis != null && protocol.regulatoryBasis.trim().length > 0;
}
function freezeReferences(references, organizationId) {
    return Object.freeze((references ?? []).map((reference) => {
        if (reference.organizationId !== organizationId) {
            throw new DomainError('CROSS_TENANT_ACCESS_DENIED', 'Protocol references must stay within the same organization.');
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
