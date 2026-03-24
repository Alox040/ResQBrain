import type { OrganizationId } from '../common/ids';
import type {
  ApprovalStatus,
  ContentPackageMemberRef,
  LifecycleAggregateKind,
  LifecycleContext,
  LifecycleTransitionCode,
  VersionedContentLifecycleState,
} from './ContentLifecycle';
import {
  CONTENT_ENTITY_LIFECYCLE_TRANSITIONS,
  CONTENT_PACKAGE_LIFECYCLE_TRANSITIONS,
} from './ContentLifecycle';

export const TRANSITION_POLICY_ROLES = [
  'author',
  'approver',
  'releaser',
  'admin',
] as const;

export type TransitionPolicyRole = (typeof TRANSITION_POLICY_ROLES)[number];

export const TRANSITION_POLICY_PERMISSIONS = [
  'content.submit',
  'content.approve',
  'content.reject',
  'content.revise',
  'content.deprecate',
  'package.submit',
  'package.approve',
  'package.reject',
  'package.revise',
  'package.release',
  'package.deprecate',
] as const;

export type TransitionPolicyPermission =
  (typeof TRANSITION_POLICY_PERMISSIONS)[number];

export const POLICY_PRECONDITION_CODES = [
  'organization-context-required',
  'organization-boundary-violation',
  'global-scope-not-releasable',
  'state-transition-not-allowed',
  'released-artifact-immutable',
  'deprecated-artifact-terminal',
  'content-version-must-be-draft',
  'content-version-must-be-approved',
  'package-version-status-mismatch',
  'package-members-required',
  'package-members-must-be-approved',
  'package-members-must-match-organization',
  'transition-not-directly-invocable',
] as const;

export type PolicyPreconditionCode =
  (typeof POLICY_PRECONDITION_CODES)[number];

export interface TransitionActor {
  readonly organizationId: OrganizationId;
  readonly roles: ReadonlyArray<TransitionPolicyRole>;
  readonly permissions: ReadonlyArray<TransitionPolicyPermission>;
}

export interface PolicyCondition {
  readonly code: PolicyPreconditionCode;
  readonly satisfied: boolean;
}

export interface TransitionPolicyRule {
  readonly code: LifecycleTransitionCode;
  readonly aggregate: LifecycleAggregateKind;
  readonly from: ApprovalStatus;
  readonly to: ApprovalStatus;
  readonly allowedRoles: ReadonlyArray<TransitionPolicyRole>;
  readonly requiredPermissions: ReadonlyArray<TransitionPolicyPermission>;
  readonly preconditions: ReadonlyArray<PolicyPreconditionCode>;
  readonly postconditions: ReadonlyArray<PolicyPreconditionCode>;
  readonly directInvocation: boolean;
  readonly releasedImmutable: boolean;
}

export interface TransitionPolicyEvaluation {
  readonly allowed: boolean;
  readonly rule: TransitionPolicyRule | null;
  readonly failedPreconditions: ReadonlyArray<PolicyPreconditionCode>;
  readonly missingRoles: ReadonlyArray<TransitionPolicyRole>;
  readonly missingPermissions: ReadonlyArray<TransitionPolicyPermission>;
}

type ContentTransitionPolicyRule = TransitionPolicyRule & {
  readonly aggregate: 'ContentEntity';
};

type PackageTransitionPolicyRule = TransitionPolicyRule & {
  readonly aggregate: 'ContentPackage';
};

const CONTENT_TRANSITION_POLICY: ReadonlyArray<ContentTransitionPolicyRule> =
  CONTENT_ENTITY_LIFECYCLE_TRANSITIONS.map((transition) => {
    switch (transition.code) {
      case 'CE-1':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['author'],
          requiredPermissions: ['content.submit'],
          preconditions: [
            'organization-context-required',
            'organization-boundary-violation',
            'content-version-must-be-draft',
          ],
          postconditions: [],
          directInvocation: true,
          releasedImmutable: false,
        };
      case 'CE-2':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['approver'],
          requiredPermissions: ['content.approve'],
          preconditions: ['content-version-must-be-draft'],
          postconditions: ['content-version-must-be-approved'],
          directInvocation: true,
          releasedImmutable: false,
        };
      case 'CE-3':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['approver'],
          requiredPermissions: ['content.reject'],
          preconditions: [],
          postconditions: [],
          directInvocation: true,
          releasedImmutable: false,
        };
      case 'CE-4':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['author'],
          requiredPermissions: ['content.revise'],
          preconditions: [],
          postconditions: [],
          directInvocation: true,
          releasedImmutable: false,
        };
      case 'CE-5':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['releaser'],
          requiredPermissions: ['package.release'],
          preconditions: [
            'transition-not-directly-invocable',
            'content-version-must-be-approved',
          ],
          postconditions: [],
          directInvocation: false,
          releasedImmutable: true,
        };
      case 'CE-6':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['releaser', 'admin'],
          requiredPermissions: ['content.deprecate'],
          preconditions: [],
          postconditions: [],
          directInvocation: true,
          releasedImmutable: true,
        };
    }
  });

const PACKAGE_TRANSITION_POLICY: ReadonlyArray<PackageTransitionPolicyRule> =
  CONTENT_PACKAGE_LIFECYCLE_TRANSITIONS.map((transition) => {
    switch (transition.code) {
      case 'CP-1':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['releaser'],
          requiredPermissions: ['package.submit'],
          preconditions: [
            'organization-context-required',
            'organization-boundary-violation',
            'package-members-required',
            'package-members-must-be-approved',
            'package-members-must-match-organization',
          ],
          postconditions: [],
          directInvocation: true,
          releasedImmutable: false,
        };
      case 'CP-2':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['approver'],
          requiredPermissions: ['package.approve'],
          preconditions: ['package-version-status-mismatch'],
          postconditions: [],
          directInvocation: true,
          releasedImmutable: false,
        };
      case 'CP-3':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['approver'],
          requiredPermissions: ['package.reject'],
          preconditions: [],
          postconditions: [],
          directInvocation: true,
          releasedImmutable: false,
        };
      case 'CP-4':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['releaser'],
          requiredPermissions: ['package.revise'],
          preconditions: [],
          postconditions: [],
          directInvocation: true,
          releasedImmutable: false,
        };
      case 'CP-5':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['releaser'],
          requiredPermissions: ['package.release'],
          preconditions: [
            'organization-context-required',
            'organization-boundary-violation',
            'global-scope-not-releasable',
            'package-version-status-mismatch',
            'package-members-must-be-approved',
            'package-members-must-match-organization',
          ],
          postconditions: [],
          directInvocation: true,
          releasedImmutable: true,
        };
      case 'CP-6':
        return {
          code: transition.code,
          aggregate: transition.aggregate,
          from: transition.from,
          to: transition.to,
          allowedRoles: ['releaser', 'admin'],
          requiredPermissions: ['package.deprecate'],
          preconditions: [],
          postconditions: [],
          directInvocation: true,
          releasedImmutable: true,
        };
    }
  });

export const TRANSITION_POLICY_RULES: ReadonlyArray<TransitionPolicyRule> = [
  ...CONTENT_TRANSITION_POLICY,
  ...PACKAGE_TRANSITION_POLICY,
] as const;

export class TransitionPolicyError extends Error {
  readonly code: PolicyPreconditionCode;

  constructor(code: PolicyPreconditionCode) {
    super(code);
    this.name = 'TransitionPolicyError';
    this.code = code;
  }
}

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
  state: VersionedContentLifecycleState,
  nextStatus: ApprovalStatus,
  actor: TransitionActor,
  context: LifecycleContext,
): TransitionPolicyEvaluation {
  const rule = getTransitionPolicyRule(
    state.aggregate,
    state.approvalStatus,
    nextStatus,
  );

  if (rule === null) {
    return {
      allowed: false,
      rule: null,
      failedPreconditions: ['state-transition-not-allowed'],
      missingRoles: [],
      missingPermissions: [],
    };
  }

  const failedPreconditions = rule.preconditions.filter(
    (code) => !isPreconditionSatisfied(code, state, actor, context),
  );
  const missingRoles = rule.allowedRoles.filter(
    (role) => !actor.roles.includes(role),
  );
  const missingPermissions = rule.requiredPermissions.filter(
    (permission) => !actor.permissions.includes(permission),
  );

  return {
    allowed:
      failedPreconditions.length === 0 &&
      missingRoles.length === 0 &&
      missingPermissions.length === 0,
    rule,
    failedPreconditions,
    missingRoles,
    missingPermissions,
  };
}

export function assertTransitionPolicy(
  state: VersionedContentLifecycleState,
  nextStatus: ApprovalStatus,
  actor: TransitionActor,
  context: LifecycleContext,
): TransitionPolicyRule {
  const evaluation = evaluateTransitionPolicy(state, nextStatus, actor, context);

  if (evaluation.rule === null) {
    throw new TransitionPolicyError('state-transition-not-allowed');
  }

  if (evaluation.failedPreconditions.length > 0) {
    throw new TransitionPolicyError(evaluation.failedPreconditions[0]);
  }

  if (evaluation.missingRoles.length > 0) {
    throw new TransitionPolicyError('state-transition-not-allowed');
  }

  if (evaluation.missingPermissions.length > 0) {
    throw new TransitionPolicyError('state-transition-not-allowed');
  }

  return evaluation.rule;
}

function isPreconditionSatisfied(
  code: PolicyPreconditionCode,
  state: VersionedContentLifecycleState,
  actor: TransitionActor,
  context: LifecycleContext,
): boolean {
  switch (code) {
    case 'organization-context-required':
      return state.organizationId !== null;
    case 'organization-boundary-violation':
      return hasMatchingOrganizationBoundary(state, actor, context);
    case 'global-scope-not-releasable':
      return state.organizationId !== null;
    case 'state-transition-not-allowed':
      return false;
    case 'released-artifact-immutable':
      return state.approvalStatus !== 'Released';
    case 'deprecated-artifact-terminal':
      return state.approvalStatus !== 'Deprecated';
    case 'content-version-must-be-draft':
      return (
        state.aggregate === 'ContentEntity' &&
        state.currentVersionStatus === 'draft'
      );
    case 'content-version-must-be-approved':
      return (
        state.aggregate === 'ContentEntity' &&
        state.currentVersionStatus === 'approved'
      );
    case 'package-version-status-mismatch':
      return (
        state.aggregate === 'ContentPackage' &&
        state.packageVersionApprovalStatus === state.approvalStatus
      );
    case 'package-members-required':
      return state.aggregate === 'ContentPackage' && state.members.length > 0;
    case 'package-members-must-be-approved':
      return (
        state.aggregate === 'ContentPackage' &&
        state.members.every((member) => member.versionStatus === 'approved')
      );
    case 'package-members-must-match-organization':
      return (
        state.aggregate === 'ContentPackage' &&
        state.members.every((member) =>
          matchesOrganization(member, state.organizationId),
        )
      );
    case 'transition-not-directly-invocable':
      return false;
  }
}

function hasMatchingOrganizationBoundary(
  state: VersionedContentLifecycleState,
  actor: TransitionActor,
  context: LifecycleContext,
): boolean {
  return (
    actor.organizationId === context.organizationId &&
    state.organizationId === context.sourceOrganizationId &&
    context.sourceOrganizationId === context.targetOrganizationId &&
    context.organizationId === context.targetOrganizationId
  );
}

function matchesOrganization(
  member: ContentPackageMemberRef,
  organizationId: OrganizationId | null,
): boolean {
  return member.organizationId === organizationId;
}
