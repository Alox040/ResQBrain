import { DomainError } from '../../shared/errors';
import { isEditableApprovalStatus, isImmutableApprovalStatus, isLockedApprovalStatus, } from './ApprovalStatus';
export function createAlgorithm(input) {
    const organizationId = assertOrgId(input.organizationId);
    return Object.freeze({
        kind: 'Algorithm',
        id: assertNonEmptyId(input.id, 'id'),
        organizationId,
        entityType: 'Algorithm',
        title: assertNonEmptyText(input.title, 'title'),
        category: normalizeOptionalText(input.category, 'category'),
        targetAudience: freezeTextArray(input.targetAudience, 'targetAudience'),
        currentVersionId: assertExplicitVersionId(input.currentVersionId),
        approvalStatus: input.approvalStatus,
        effectiveDate: cloneOptionalDate(input.effectiveDate, 'effectiveDate'),
        ...normalizeDeprecation(input.deprecationDate, input.deprecationReason),
        decisionLogic: freezeDecisionLogic(input.decisionLogic, organizationId),
        prerequisites: freezeReferences(input.prerequisites, organizationId, 'prerequisites'),
        auditTrail: freezeAuditTrail(input.auditTrail),
    });
}
export function isAlgorithmEditable(algorithm) {
    return isEditableApprovalStatus(algorithm.approvalStatus);
}
export function isAlgorithmLocked(algorithm) {
    return isLockedApprovalStatus(algorithm.approvalStatus);
}
export function isAlgorithmImmutable(algorithm) {
    return isImmutableApprovalStatus(algorithm.approvalStatus);
}
export function isAlgorithmStructurallyComplete(algorithm) {
    if (algorithm.decisionLogic.length === 0) {
        return false;
    }
    const nodeIds = new Set();
    let hasTerminalNode = false;
    for (const node of algorithm.decisionLogic) {
        if (node.id.trim().length === 0 || nodeIds.has(node.id)) {
            return false;
        }
        nodeIds.add(node.id);
        if (node.terminal) {
            hasTerminalNode = true;
            if (node.nextNodeIds.length > 0) {
                return false;
            }
            continue;
        }
        if (node.nextNodeIds.length === 0) {
            return false;
        }
    }
    if (!hasTerminalNode) {
        return false;
    }
    for (const node of algorithm.decisionLogic) {
        for (const nextNodeId of node.nextNodeIds) {
            if (!nodeIds.has(nextNodeId)) {
                return false;
            }
        }
    }
    return true;
}
function freezeDecisionLogic(nodes, organizationId) {
    return Object.freeze((nodes ?? []).map((node) => Object.freeze({
        id: assertNonEmptyText(node.id, 'decisionLogic.id'),
        label: assertNonEmptyText(node.label, 'decisionLogic.label'),
        terminal: Boolean(node.terminal),
        nextNodeIds: freezeTextArray(node.nextNodeIds, 'decisionLogic.nextNodeIds'),
        medicationReferences: freezeReferences(node.medicationReferences, organizationId, 'decisionLogic.medicationReferences'),
    })));
}
function freezeReferences(references, organizationId, field) {
    return Object.freeze((references ?? []).map((reference) => {
        if (reference.organizationId !== organizationId) {
            throw new DomainError('CROSS_TENANT_ACCESS_DENIED', `${field} must stay within the same organization.`);
        }
        return Object.freeze({
            entityId: assertNonEmptyId(reference.entityId, `${field}.entityId`),
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
