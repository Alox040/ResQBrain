import type { ApprovalStatus } from '../common/ApprovalStatus';
import type { OrganizationId, UserId } from '../common/ids';
import type { PermissionKey } from '../common/permissionKey';
import type { UserRoleName } from '../common/userRoleName';
import type { LifecycleAggregateKind, LifecycleState } from './ContentLifecycle';
import { canTransitionLifecycleState } from './ContentLifecycle';

export type TransitionPolicyRole = UserRoleName;
export type TransitionPolicyPermission = PermissionKey;

export interface TransitionActor {
  readonly organizationId: OrganizationId;
  /** Present when the actor is a concrete user (audit / attribution). */
  readonly userId?: UserId;
  readonly roles: ReadonlyArray<TransitionPolicyRole>;
  readonly permissions: ReadonlyArray<TransitionPolicyPermission>;
}

export interface TransitionPolicyRule {
  readonly aggregate: LifecycleAggregateKind;
  readonly from: ApprovalStatus;
  readonly to: ApprovalStatus;
  readonly allowedRoles: ReadonlyArray<TransitionPolicyRole>;
  readonly requiredPermissions: ReadonlyArray<TransitionPolicyPermission>;
}

export interface TransitionPolicyEvaluation {
  readonly allowed: boolean;
  readonly rule: TransitionPolicyRule | null;
  readonly sameOrganization: boolean;
  readonly hasRequiredRole: boolean;
  readonly hasRequiredPermission: boolean;
  readonly lifecycleAllowsTransition: boolean;
}

export const TRANSITION_POLICY_RULES: ReadonlyArray<TransitionPolicyRule> = [
  {
    aggregate: 'ContentEntity',
    from: 'Draft',
    to: 'InReview',
    allowedRoles: ['Author', 'OrganizationAdmin'],
    requiredPermissions: ['content.submit'],
  },
  {
    aggregate: 'ContentEntity',
    from: 'InReview',
    to: 'Approved',
    allowedRoles: ['Approver', 'OrganizationAdmin'],
    requiredPermissions: ['content.approve'],
  },
  {
    aggregate: 'ContentEntity',
    from: 'InReview',
    to: 'Rejected',
    allowedRoles: ['Approver', 'OrganizationAdmin'],
    requiredPermissions: ['content.reject'],
  },
  {
    aggregate: 'ContentEntity',
    from: 'Rejected',
    to: 'Draft',
    allowedRoles: ['Author', 'OrganizationAdmin'],
    requiredPermissions: ['content.revise'],
  },
  {
    aggregate: 'ContentEntity',
    from: 'Released',
    to: 'Deprecated',
    allowedRoles: ['Releaser', 'OrganizationAdmin'],
    requiredPermissions: ['content.deprecate'],
  },
  {
    aggregate: 'ContentPackage',
    from: 'Draft',
    to: 'InReview',
    allowedRoles: ['Reviewer', 'OrganizationAdmin'],
    requiredPermissions: ['package.submit'],
  },
  {
    aggregate: 'ContentPackage',
    from: 'InReview',
    to: 'Approved',
    allowedRoles: ['Approver', 'OrganizationAdmin'],
    requiredPermissions: ['package.approve'],
  },
  {
    aggregate: 'ContentPackage',
    from: 'InReview',
    to: 'Rejected',
    allowedRoles: ['Approver', 'OrganizationAdmin'],
    requiredPermissions: ['package.reject'],
  },
  {
    aggregate: 'ContentPackage',
    from: 'Approved',
    to: 'Released',
    allowedRoles: ['Releaser', 'OrganizationAdmin'],
    requiredPermissions: ['package.release'],
  },
  {
    aggregate: 'ContentPackage',
    from: 'Released',
    to: 'Deprecated',
    allowedRoles: ['Releaser', 'OrganizationAdmin'],
    requiredPermissions: ['package.deprecate'],
  },
] as const;

export function getTransitionPolicyRule(
  aggregate: LifecycleAggregateKind,
  from: ApprovalStatus,
  to: ApprovalStatus,
): TransitionPolicyRule | null {
  return (
    TRANSITION_POLICY_RULES.find(
      (rule) =>
        rule.aggregate === aggregate && rule.from === from && rule.to === to,
    ) ?? null
  );
}

export function evaluateTransitionPolicy(
  state: LifecycleState,
  nextStatus: ApprovalStatus,
  actor: TransitionActor,
): TransitionPolicyEvaluation {
  const rule = getTransitionPolicyRule(
    state.aggregate,
    state.approvalStatus,
    nextStatus,
  );
  const sameOrganization = state.organizationId === actor.organizationId;
  const hasRequiredRole =
    rule === null ? false : rule.allowedRoles.some((role) => actor.roles.includes(role));
  const hasRequiredPermission =
    rule === null
      ? false
      : rule.requiredPermissions.every((permission) =>
          actor.permissions.includes(permission),
        );
  const lifecycleAllowsTransition = canTransitionLifecycleState(state, nextStatus);

  return {
    allowed:
      rule !== null &&
      sameOrganization &&
      hasRequiredRole &&
      hasRequiredPermission &&
      lifecycleAllowsTransition,
    rule,
    sameOrganization,
    hasRequiredRole,
    hasRequiredPermission,
    lifecycleAllowsTransition,
  };
}
