import { ApprovalStatus } from '../../content/entities';
import { allow, deny, DenyReason } from '../../shared/types';
import { EntityType as EntityTypeValue } from '../../versioning/entities';
import { evaluateAccess } from './OrganizationScopedAccessPolicy';
export function evaluateDeprecation(context) {
    const organizationId = context.organizationId;
    if (typeof organizationId !== 'string' || organizationId.trim().length === 0) {
        return deny(DenyReason.MISSING_ORGANIZATION_CONTEXT, {
            entityId: context.entityId,
            entityType: context.entityType,
        });
    }
    if (context.actor.organizationId !== organizationId) {
        return deny(DenyReason.CROSS_TENANT_ACCESS_DENIED, {
            actorOrganizationId: context.actor.organizationId ?? null,
            organizationId,
        });
    }
    if (context.currentState !== ApprovalStatus.Released) {
        return deny(DenyReason.INVALID_SOURCE_STATE, {
            entityId: context.entityId,
            currentState: context.currentState,
        });
    }
    const accessDecision = evaluateAccess(buildAccessContext(context, organizationId));
    if (!accessDecision.allowed) {
        return accessDecision;
    }
    if (!(context.deprecationDate instanceof Date) || Number.isNaN(context.deprecationDate.getTime())) {
        return deny(DenyReason.DEPRECATION_DATE_REQUIRED, {
            entityId: context.entityId,
        });
    }
    if (!hasSubstantiveRationale(context.deprecationReason)) {
        return deny(DenyReason.RATIONALE_REQUIRED, {
            entityId: context.entityId,
        });
    }
    return allow({
        warnings: context.warnings,
        context: {
            organizationId,
            entityId: context.entityId,
            entityType: context.entityType,
        },
    });
}
function buildAccessContext(context, organizationId) {
    return {
        actor: context.actor,
        organizationId,
        organization: context.organization,
        capability: context.entityType === EntityTypeValue.ContentPackage
            ? 'package.deprecate'
            : 'content.deprecate',
        entityId: context.entityId,
        entityType: context.entityType,
    };
}
function hasSubstantiveRationale(value) {
    if (typeof value !== 'string' || value.trim().length < 3) {
        return false;
    }
    const normalized = value.trim().toLowerCase();
    return !['n/a', 'na', 'none', 'tbd', '-'].includes(normalized);
}
