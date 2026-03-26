import { ApprovalStatus, isImmutableApprovalStatus, isTerminalApprovalStatus, } from '../../content/entities';
import { allow, deny, DenyReason } from '../../shared/types';
import { OrganizationStatus } from '../../tenant/entities';
import { evaluateAccess } from './OrganizationScopedAccessPolicy';
export function evaluateTransition(context) {
    const organizationId = context.organizationId;
    if (typeof organizationId !== 'string' || organizationId.trim().length === 0) {
        return deny(DenyReason.MISSING_ORGANIZATION_CONTEXT, {
            entityId: context.entityId,
            currentState: context.currentState,
            targetState: context.targetState,
        });
    }
    if (context.actor.organizationId !== organizationId) {
        return deny(DenyReason.CROSS_TENANT_ACCESS_DENIED, {
            actorOrganizationId: context.actor.organizationId ?? null,
            organizationId,
        });
    }
    if (isImmutableApprovalStatus(context.currentState)) {
        return deny(DenyReason.ENTITY_IMMUTABLE, {
            entityId: context.entityId,
            currentState: context.currentState,
            targetState: context.targetState,
        });
    }
    if (isTerminalApprovalStatus(context.currentState)) {
        return deny(DenyReason.VERSION_TERMINAL, {
            entityId: context.entityId,
            currentState: context.currentState,
            targetState: context.targetState,
        });
    }
    const requiredCapability = resolveRequiredCapability(context.entityType, context.currentState, context.targetState);
    if (requiredCapability == null) {
        return deny(DenyReason.TRANSITION_NOT_PERMITTED, {
            entityId: context.entityId,
            currentState: context.currentState,
            targetState: context.targetState,
        });
    }
    if (!isExpectedSourceState(context.currentState, context.targetState)) {
        return deny(DenyReason.INVALID_SOURCE_STATE, {
            entityId: context.entityId,
            currentState: context.currentState,
            targetState: context.targetState,
        });
    }
    if (context.currentState === ApprovalStatus.Draft &&
        context.targetState === ApprovalStatus.InReview &&
        context.organization?.status !== OrganizationStatus.ACTIVE) {
        return deny(DenyReason.ORGANIZATION_NOT_ACTIVE, {
            organizationId,
            status: context.organization?.status ?? null,
        });
    }
    const accessDecision = evaluateAccess(buildAccessContext(context, organizationId, requiredCapability));
    if (!accessDecision.allowed) {
        return accessDecision;
    }
    if ((context.targetState === ApprovalStatus.Approved ||
        context.targetState === ApprovalStatus.Rejected) &&
        context.requireSeparationOfDuty === true &&
        context.submittedBy === context.actor.userId) {
        return deny(DenyReason.SEPARATION_OF_DUTY_VIOLATION, {
            entityId: context.entityId,
            submittedBy: context.submittedBy,
            actorUserId: context.actor.userId,
        });
    }
    if (context.currentState === ApprovalStatus.Draft &&
        context.targetState === ApprovalStatus.InReview &&
        context.structurallyComplete === false) {
        return deny(DenyReason.CONTENT_STRUCTURALLY_INCOMPLETE, {
            entityId: context.entityId,
            entityType: context.entityType,
        });
    }
    if (context.currentState === ApprovalStatus.Draft &&
        context.targetState === ApprovalStatus.InReview &&
        context.hasDeprecatedReference === true) {
        return deny(DenyReason.DEPRECATED_REFERENCE_IN_SUBMISSION, {
            entityId: context.entityId,
            entityType: context.entityType,
        });
    }
    if ((context.targetState === ApprovalStatus.Approved ||
        context.targetState === ApprovalStatus.Rejected) &&
        context.quorumResolved !== true) {
        return deny(DenyReason.QUORUM_NOT_RESOLVED, {
            entityId: context.entityId,
            targetState: context.targetState,
        });
    }
    if ((context.targetState === ApprovalStatus.Rejected ||
        (context.currentState === ApprovalStatus.Approved &&
            context.targetState === ApprovalStatus.InReview)) &&
        !hasSubstantiveRationale(context.rationale)) {
        return deny(DenyReason.RATIONALE_REQUIRED, {
            entityId: context.entityId,
            targetState: context.targetState,
        });
    }
    if (context.currentState === ApprovalStatus.Approved &&
        context.targetState === ApprovalStatus.InReview &&
        context.referencedByReleasedPackage === true) {
        return deny(DenyReason.ENTITY_ALREADY_RELEASED, {
            entityId: context.entityId,
        });
    }
    return allow({
        context: {
            organizationId,
            entityId: context.entityId,
            currentState: context.currentState,
            targetState: context.targetState,
            capability: requiredCapability,
        },
    });
}
function buildAccessContext(context, organizationId, capability) {
    return {
        actor: context.actor,
        organizationId,
        organization: context.organization,
        capability,
        entityId: context.entityId,
        entityType: context.entityType,
        targetScope: context.targetScope,
    };
}
function resolveRequiredCapability(entityType, currentState, targetState) {
    const isPackage = entityType === 'ContentPackage';
    if (currentState === ApprovalStatus.Draft && targetState === ApprovalStatus.InReview) {
        return isPackage ? 'package.submit' : 'content.submit';
    }
    if (currentState === ApprovalStatus.InReview && targetState === ApprovalStatus.Approved) {
        return isPackage ? 'package.approve' : 'content.approve';
    }
    if (currentState === ApprovalStatus.InReview && targetState === ApprovalStatus.Rejected) {
        return isPackage ? 'package.reject' : 'content.reject';
    }
    if (currentState === ApprovalStatus.Approved && targetState === ApprovalStatus.InReview) {
        return isPackage ? 'package.recall' : 'content.recall';
    }
    return null;
}
function isExpectedSourceState(currentState, targetState) {
    if (targetState === ApprovalStatus.InReview) {
        return currentState === ApprovalStatus.Draft || currentState === ApprovalStatus.Approved;
    }
    if (targetState === ApprovalStatus.Approved ||
        targetState === ApprovalStatus.Rejected) {
        return currentState === ApprovalStatus.InReview;
    }
    return false;
}
function hasSubstantiveRationale(value) {
    if (typeof value !== 'string' || value.trim().length < 3) {
        return false;
    }
    const normalized = value.trim().toLowerCase();
    return !['n/a', 'na', 'none', 'tbd', '-'].includes(normalized);
}
