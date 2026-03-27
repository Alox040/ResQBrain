import { allow, deny, DenyReason, type OrgId, type PolicyDecision, type UserId } from '../../shared/types';
import type { ScopeLevel } from '../../tenant/entities';
import type { EntityType } from '../../versioning/entities';
import type { Capability } from '../entities';
import { isUserRoleActive } from '../entities/UserRole';
import { getCapabilityGrantingRoles } from '../policies';
import type { ActorContext, ScopedTarget } from '../policies/PolicyContext';

export interface PermissionTargetEntity {
  readonly organizationId?: OrgId | null | undefined;
  readonly entityId?: string;
  readonly entityType?: EntityType;
  readonly scopeLevel?: ScopeLevel;
  readonly scopeTargetId?: string | null;
}

export interface PermissionEvaluationContext {
  readonly at?: Date;
  readonly authorUserId?: UserId | null;
  readonly approverUserId?: UserId | null;
  readonly approverUserIds?: readonly UserId[];
  readonly releaserUserId?: UserId | null;
}

export interface EvaluateOrganizationAccessInput {
  readonly actor: ActorContext;
  readonly organizationId: OrgId | null | undefined;
  readonly capability?: Capability;
  readonly targetEntity?: PermissionTargetEntity | null;
}

export interface EvaluateSeparationOfDutiesInput {
  readonly actor: Pick<ActorContext, 'userId'>;
  readonly capability: Capability;
  readonly targetEntity?: Pick<PermissionTargetEntity, 'entityId' | 'entityType'> | null;
  readonly context?: PermissionEvaluationContext | null;
}

export interface EvaluateCapabilityInput {
  readonly actor: ActorContext;
  readonly organizationId: OrgId | null | undefined;
  readonly capability: Capability;
  readonly targetEntity?: PermissionTargetEntity | null;
  readonly context?: PermissionEvaluationContext | null;
}

export function evaluateCapability(input: EvaluateCapabilityInput): PolicyDecision {
  const accessDecision = evaluateOrganizationAccess({
    actor: input.actor,
    organizationId: input.organizationId,
    capability: input.capability,
    targetEntity: input.targetEntity,
  });

  if (!accessDecision.allowed) {
    return accessDecision;
  }

  const organizationId = input.organizationId as OrgId;
  const grantingRoles = getCapabilityGrantingRoles(
    input.actor,
    input.capability,
    organizationId,
    {
      at: input.context?.at,
      entityType: input.targetEntity?.entityType,
      targetScope: normalizeTargetScope(input.targetEntity),
    },
  );

  if (grantingRoles.length === 0) {
    return deny(DenyReason.CAPABILITY_NOT_GRANTED, {
      organizationId,
      capability: input.capability,
      entityId: input.targetEntity?.entityId ?? null,
      entityType: input.targetEntity?.entityType ?? null,
    });
  }

  const sodDecision = evaluateSeparationOfDuties({
    actor: input.actor,
    capability: input.capability,
    targetEntity: input.targetEntity,
    context: input.context,
  });

  if (!sodDecision.allowed) {
    return sodDecision;
  }

  return allow({
    context: {
      organizationId,
      capability: input.capability,
      entityId: input.targetEntity?.entityId ?? null,
      entityType: input.targetEntity?.entityType ?? null,
      grantingRoleIds: grantingRoles.map((role) => role.id),
    },
  });
}

export function evaluateOrganizationAccess(
  input: EvaluateOrganizationAccessInput,
): PolicyDecision {
  const organizationId = normalizeOrganizationId(input.organizationId);
  if (organizationId == null) {
    return deny(DenyReason.MISSING_ORGANIZATION_CONTEXT, {
      capability: input.capability ?? null,
      entityId: input.targetEntity?.entityId ?? null,
    });
  }

  if (input.actor.organizationId !== organizationId) {
    return deny(DenyReason.CROSS_TENANT_ACCESS_DENIED, {
      actorOrganizationId: input.actor.organizationId ?? null,
      organizationId,
    });
  }

  const targetOrganizationId = normalizeOrganizationId(input.targetEntity?.organizationId);
  if (targetOrganizationId != null && targetOrganizationId !== organizationId) {
    return deny(DenyReason.CROSS_TENANT_ACCESS_DENIED, {
      organizationId,
      targetOrganizationId,
      entityId: input.targetEntity?.entityId ?? null,
    });
  }

  const at = new Date();
  const activeRoles = input.actor.roles.filter(
    (role) =>
      role.userId === input.actor.userId &&
      role.organizationId === organizationId &&
      isUserRoleActive(role, at),
  );

  if (activeRoles.length === 0) {
    return deny(DenyReason.NO_ACTIVE_ROLE, {
      organizationId,
      userId: input.actor.userId,
    });
  }

  return allow({
    context: {
      organizationId,
      activeRoleIds: activeRoles.map((role) => role.id),
    },
  });
}

export function evaluateSeparationOfDuties(
  input: EvaluateSeparationOfDutiesInput,
): PolicyDecision {
  const actorUserId = normalizeUserId(input.actor.userId);
  const authorUserId = normalizeUserId(input.context?.authorUserId);
  const releaserUserId = normalizeUserId(input.context?.releaserUserId);
  const approverUserIds = new Set<UserId>();

  const approverUserId = normalizeUserId(input.context?.approverUserId);
  if (approverUserId != null) {
    approverUserIds.add(approverUserId);
  }

  for (const value of input.context?.approverUserIds ?? []) {
    const normalized = normalizeUserId(value);
    if (normalized != null) {
      approverUserIds.add(normalized);
    }
  }

  if (actorUserId != null && isApprovalCapability(input.capability) && authorUserId === actorUserId) {
    return deny(DenyReason.SEPARATION_OF_DUTY_VIOLATION, {
      capability: input.capability,
      entityId: input.targetEntity?.entityId ?? null,
      entityType: input.targetEntity?.entityType ?? null,
      authorUserId,
      approverUserId: actorUserId,
    });
  }

  if (
    actorUserId != null &&
    isReleaseCapability(input.capability) &&
    approverUserIds.has(actorUserId)
  ) {
    return deny(DenyReason.SEPARATION_OF_DUTY_VIOLATION, {
      capability: input.capability,
      entityId: input.targetEntity?.entityId ?? null,
      entityType: input.targetEntity?.entityType ?? null,
      approverUserIds: Object.freeze(Array.from(approverUserIds)),
      releaserUserId: actorUserId,
    });
  }

  if (releaserUserId != null && approverUserIds.has(releaserUserId)) {
    return deny(DenyReason.SEPARATION_OF_DUTY_VIOLATION, {
      capability: input.capability,
      entityId: input.targetEntity?.entityId ?? null,
      entityType: input.targetEntity?.entityType ?? null,
      approverUserIds: Object.freeze(Array.from(approverUserIds)),
      releaserUserId,
    });
  }

  return allow();
}

function normalizeTargetScope(
  targetEntity: PermissionTargetEntity | null | undefined,
): ScopedTarget | null {
  if (targetEntity?.scopeLevel == null) {
    return null;
  }

  return {
    scopeLevel: targetEntity.scopeLevel,
    scopeTargetId: targetEntity.scopeTargetId ?? null,
  };
}

function normalizeOrganizationId(
  organizationId: OrgId | null | undefined,
): OrgId | null {
  if (typeof organizationId !== 'string') {
    return null;
  }

  const normalized = organizationId.trim();
  return normalized.length > 0 ? (normalized as OrgId) : null;
}

function normalizeUserId(userId: string | null | undefined): UserId | null {
  if (typeof userId !== 'string') {
    return null;
  }

  const normalized = userId.trim();
  return normalized.length > 0 ? (normalized as UserId) : null;
}

function isApprovalCapability(capability: Capability): boolean {
  return capability === 'governance.approve' || capability.endsWith('.approve');
}

function isReleaseCapability(capability: Capability): boolean {
  return capability.endsWith('.release');
}
