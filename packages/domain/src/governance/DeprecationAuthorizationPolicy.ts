import type { ApprovalStatus } from '../lifecycle';
import type { PermissionKey } from '../common/permissionKey';
import type {
  AccessContext,
  AccessPolicyEvaluation,
  AccessSubject,
} from './AccessPolicy';
import { evaluateOrganizationAccess } from './OrganizationScopedAccessPolicy';
import type { LifecycleAggregateKind } from '../lifecycle';

export interface DeprecationAuthorizationRequest {
  readonly subject: AccessSubject;
  readonly context: AccessContext;
  readonly aggregate: LifecycleAggregateKind;
  readonly fromStatus: ApprovalStatus;
}

export type DeprecationAuthorizationDenyReason =
  | 'cross-tenant-deprecation-forbidden'
  | 'releaser-role-required'
  | 'content-deprecate-permission-required'
  | 'package-deprecate-permission-required'
  | 'source-status-must-be-released';

export interface DeprecationAuthorizationDecision {
  readonly allowed: boolean;
  readonly evaluation: AccessPolicyEvaluation;
  readonly denyReason?: DeprecationAuthorizationDenyReason;
}

export const DEPRECATION_PERMISSION_MAP: Record<
  LifecycleAggregateKind,
  PermissionKey
> = {
  ContentEntity: 'content.deprecate',
  ContentPackage: 'package.deprecate',
};

function getDeprecationPermissionDenyReason(
  aggregate: LifecycleAggregateKind,
): DeprecationAuthorizationDenyReason {
  return aggregate === 'ContentEntity'
    ? 'content-deprecate-permission-required'
    : 'package-deprecate-permission-required';
}

export function authorizeDeprecation(
  request: DeprecationAuthorizationRequest,
): DeprecationAuthorizationDecision {
  const accessDecision = evaluateOrganizationAccess({
    subject: request.subject,
    context: request.context,
    permission: DEPRECATION_PERMISSION_MAP[request.aggregate],
    role: 'Releaser',
  });

  if (request.fromStatus !== 'Released') {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: 'source-status-must-be-released',
    };
  }

  if (!accessDecision.organizationScoped) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: 'cross-tenant-deprecation-forbidden',
    };
  }

  if (!accessDecision.hasRequiredRole) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: 'releaser-role-required',
    };
  }

  if (!accessDecision.hasRequiredPermission) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: getDeprecationPermissionDenyReason(request.aggregate),
    };
  }

  return {
    allowed: true,
    evaluation: accessDecision.evaluation,
  };
}
