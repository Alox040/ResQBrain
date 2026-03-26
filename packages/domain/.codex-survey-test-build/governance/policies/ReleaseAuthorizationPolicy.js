import { ApprovalStatus } from '../../content/entities';
import { allow, deny, DenyReason } from '../../shared/types';
import { OrganizationStatus } from '../../tenant/entities';
import { evaluateAccess } from './OrganizationScopedAccessPolicy';
export function evaluateRelease(context) {
    const organizationId = context.organizationId;
    if (typeof organizationId !== 'string' || organizationId.trim().length === 0) {
        return deny(DenyReason.MISSING_ORGANIZATION_CONTEXT, {
            packageId: context.packageId,
            packageVersionId: context.packageVersionId,
        });
    }
    if (context.actor.organizationId !== organizationId) {
        return deny(DenyReason.CROSS_TENANT_ACCESS_DENIED, {
            actorOrganizationId: context.actor.organizationId ?? null,
            organizationId,
        });
    }
    if (context.organization?.status !== OrganizationStatus.ACTIVE) {
        return deny(DenyReason.ORGANIZATION_NOT_ACTIVE, {
            organizationId,
            status: context.organization?.status ?? null,
        });
    }
    const accessDecision = evaluateAccess(buildAccessContext(context, organizationId));
    if (!accessDecision.allowed) {
        return accessDecision;
    }
    if (context.approvedByUserIds.includes(context.actor.userId)) {
        return deny(DenyReason.SEPARATION_OF_DUTY_VIOLATION, {
            packageId: context.packageId,
            actorUserId: context.actor.userId,
        });
    }
    if (context.packageApprovalStatus !== ApprovalStatus.Approved) {
        return deny(DenyReason.PACKAGE_NOT_APPROVED, {
            packageId: context.packageId,
            packageApprovalStatus: context.packageApprovalStatus,
        });
    }
    for (const entry of context.composition) {
        if (entry.organizationId !== organizationId) {
            return deny(DenyReason.CROSS_TENANT_COMPOSITION_ENTRY, {
                packageId: context.packageId,
                entityId: entry.entityId,
            });
        }
        if (entry.approvalStatus !== ApprovalStatus.Approved) {
            return deny(DenyReason.COMPOSITION_ENTRY_NOT_APPROVED, {
                packageId: context.packageId,
                entityId: entry.entityId,
                approvalStatus: entry.approvalStatus,
            });
        }
        if (entry.versionId !== entry.currentVersionId) {
            return deny(DenyReason.COMPOSITION_VERSION_STALE, {
                packageId: context.packageId,
                entityId: entry.entityId,
                versionId: entry.versionId,
                currentVersionId: entry.currentVersionId,
            });
        }
    }
    for (const scopeReference of context.scopeReferences) {
        if (scopeReference.organizationId !== organizationId) {
            return deny(DenyReason.CROSS_TENANT_SCOPE_REFERENCE, {
                organizationId,
                scopeTargetId: scopeReference.scopeTargetId ?? null,
            });
        }
        if (!scopeReference.active) {
            return deny(DenyReason.TARGET_SCOPE_INACTIVE, {
                organizationId,
                scopeLevel: scopeReference.scopeLevel,
                scopeTargetId: scopeReference.scopeTargetId ?? null,
            });
        }
    }
    if (context.hasConflictingActiveRelease) {
        return deny(DenyReason.CONFLICTING_ACTIVE_RELEASE, {
            packageId: context.packageId,
            packageVersionId: context.packageVersionId,
        });
    }
    if (context.hasHardBlockingDependency) {
        return deny(DenyReason.DEPENDENCY_HARD_BLOCK, {
            packageId: context.packageId,
            packageVersionId: context.packageVersionId,
        });
    }
    if (context.rollbackSourceExists === false) {
        return deny(DenyReason.ROLLBACK_SOURCE_NOT_FOUND, {
            packageId: context.packageId,
            packageVersionId: context.packageVersionId,
        });
    }
    if (context.rollbackContainsDeprecatedEntries === true) {
        return deny(DenyReason.DEPRECATED_REFERENCE_IN_COMPOSITION, {
            packageId: context.packageId,
            packageVersionId: context.packageVersionId,
        });
    }
    return allow({
        warnings: context.warningDependencies,
        context: {
            organizationId,
            packageId: context.packageId,
            packageVersionId: context.packageVersionId,
            compositionSize: context.composition.length,
        },
    });
}
function buildAccessContext(context, organizationId) {
    return {
        actor: context.actor,
        organizationId,
        organization: context.organization,
        capability: 'package.release',
        entityId: context.packageId,
        entityType: context.packageEntityType,
    };
}
