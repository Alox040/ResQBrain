import type { OrgId } from '../../shared/types';

import { allow, deny, DenyReason, type PolicyDecision } from '../../shared/types';
import { OrganizationStatus } from '../../tenant/entities';
import type { ScopeLevel } from '../../tenant/entities';
import { isUserRoleActive } from '../entities/UserRole';
import { getCapabilityGrantingRoles } from './hasCapability';
import type { PolicyContext, ScopedTarget } from './PolicyContext';

export function evaluateAccess(context: PolicyContext): PolicyDecision {
  const organizationId = context.organizationId;

  if (typeof organizationId !== 'string' || organizationId.trim().length === 0) {
    return deny(DenyReason.MISSING_ORGANIZATION_CONTEXT, {
      capability: context.capability,
      entityId: context.entityId,
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

  const grantingRoles = getCapabilityGrantingRoles(
    context.actor,
    context.capability,
    organizationId as OrgId,
    {
      entityType: context.entityType,
      targetScope: normalizeScopedTarget(context.targetScope),
    },
  );

  if (grantingRoles.length === 0) {
    const hasAnyActiveRole = context.actor.roles.some(
      (role) =>
        role.userId === context.actor.userId &&
        role.organizationId === organizationId &&
        isUserRoleActive(role, new Date()),
    );

    if (!hasAnyActiveRole) {
      return deny(DenyReason.NO_ACTIVE_ROLE, {
        organizationId,
        userId: context.actor.userId,
      });
    }

    const hasSelfAssignment =
      context.capability === 'role.assign' &&
      context.targetUserId != null &&
      context.targetUserId === context.actor.userId;

    if (hasSelfAssignment) {
      return deny(DenyReason.SELF_ASSIGNMENT_PROHIBITED, {
        organizationId,
        targetUserId: context.targetUserId,
      });
    }

    const hasCapabilityIgnoringScope = getCapabilityGrantingRoles(
      context.actor,
      context.capability,
      organizationId as OrgId,
      {
        entityType: context.entityType,
      },
    ).length > 0;

    if (hasCapabilityIgnoringScope) {
      return deny(DenyReason.SCOPE_MISMATCH, {
        organizationId,
        targetScope: context.targetScope ?? null,
      });
    }

    return deny(DenyReason.CAPABILITY_NOT_GRANTED, {
      capability: context.capability,
      entityType: context.entityType,
      organizationId,
    });
  }

  if (
    context.capability === 'role.assign' &&
    context.targetUserId != null &&
    context.targetUserId === context.actor.userId
  ) {
    return deny(DenyReason.SELF_ASSIGNMENT_PROHIBITED, {
      organizationId,
      targetUserId: context.targetUserId,
    });
  }

  return allow({
    context: {
      organizationId,
      capability: context.capability,
      entityId: context.entityId,
      grantingRoleIds: grantingRoles.map((role) => role.id),
    },
  });
}

function normalizeScopedTarget(
  targetScope: PolicyContext['targetScope'],
): ScopedTarget | null {
  if (targetScope == null) {
    return null;
  }

  return {
    scopeLevel: targetScope.scopeLevel as ScopeLevel,
    scopeTargetId:
      'scopeTargetId' in targetScope ? (targetScope.scopeTargetId ?? null) : null,
  };
}
