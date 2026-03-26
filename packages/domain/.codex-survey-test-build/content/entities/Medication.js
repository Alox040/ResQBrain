import { DomainError } from '../../shared/errors';
import { isEditableApprovalStatus, isImmutableApprovalStatus, isLockedApprovalStatus, } from './ApprovalStatus';
import { createScopeTarget } from './ScopeTarget';
export function createMedication(input) {
    return Object.freeze({
        kind: 'Medication',
        id: assertNonEmptyId(input.id, 'id'),
        organizationId: assertOrgId(input.organizationId),
        entityType: 'Medication',
        title: assertNonEmptyText(input.title, 'title'),
        genericName: assertNonEmptyText(input.genericName, 'genericName'),
        brandNames: freezeTextArray(input.brandNames, 'brandNames'),
        dosageGuidelines: freezeDosageGuidelines(input.dosageGuidelines),
        contraindicationsRef: normalizeOptionalText(input.contraindicationsRef, 'contraindicationsRef'),
        storageRequirements: normalizeOptionalText(input.storageRequirements, 'storageRequirements'),
        formularyScope: input.formularyScope
            ? createScopeTarget(input.formularyScope)
            : null,
        currentVersionId: assertExplicitVersionId(input.currentVersionId),
        approvalStatus: input.approvalStatus,
        effectiveDate: cloneOptionalDate(input.effectiveDate, 'effectiveDate'),
        ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
        auditTrail: freezeAuditTrail(input.auditTrail),
    });
}
export function isMedicationEditable(medication) {
    return isEditableApprovalStatus(medication.approvalStatus);
}
export function isMedicationLocked(medication) {
    return isLockedApprovalStatus(medication.approvalStatus);
}
export function isMedicationImmutable(medication) {
    return isImmutableApprovalStatus(medication.approvalStatus);
}
export function isMedicationStructurallyComplete(medication) {
    return medication.dosageGuidelines.some((guideline) => guideline.route.trim().length > 0 && guideline.doseRange.trim().length > 0);
}
function freezeDosageGuidelines(guidelines) {
    return Object.freeze((guidelines ?? []).map((guideline) => Object.freeze({
        route: assertNonEmptyText(guideline.route, 'dosageGuidelines.route'),
        doseRange: assertNonEmptyText(guideline.doseRange, 'dosageGuidelines.doseRange'),
        weightBased: Boolean(guideline.weightBased),
    })));
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
