import type { PermissionKey } from '../common/permissionKey';
import type {
  AccessContext,
  AccessPolicyEvaluation,
  AccessSubject,
} from './AccessPolicy';
import { evaluateOrganizationAccess } from './OrganizationScopedAccessPolicy';
import type { LifecycleAggregateKind } from '../lifecycle/ContentLifecycle';

export interface ApprovalAuthorizationRequest {
  readonly subject: AccessSubject;
  readonly context: AccessContext;
  readonly action: 'approve' | 'reject';
  readonly aggregate: LifecycleAggregateKind;
}

export type ApprovalAuthorizationDenyReason =
  | 'cross-tenant-access-forbidden'
  | 'approver-role-required'
  | 'content-approve-permission-required'
  | 'content-reject-permission-required'
  | 'package-approve-permission-required'
  | 'package-reject-permission-required';

export interface ApprovalAuthorizationDecision {
  readonly allowed: boolean;
  readonly evaluation: AccessPolicyEvaluation;
  readonly denyReason?: ApprovalAuthorizationDenyReason;
}

export const APPROVAL_PERMISSION_MAP: Record<
  'approve' | 'reject',
  Record<LifecycleAggregateKind, PermissionKey>
> = {
  approve: {
    ContentEntity: 'content.approve',
    ContentPackage: 'package.approve',
  },
  reject: {
    ContentEntity: 'content.reject',
    ContentPackage: 'package.reject',
  },
};

function getApprovalPermissionDenyReason(
  action: 'approve' | 'reject',
  aggregate: LifecycleAggregateKind,
): ApprovalAuthorizationDenyReason {
  if (aggregate === 'ContentEntity') {
    return action === 'approve'
      ? 'content-approve-permission-required'
      : 'content-reject-permission-required';
  }

  return action === 'approve'
    ? 'package-approve-permission-required'
    : 'package-reject-permission-required';
}

export function authorizeApproval(
  request: ApprovalAuthorizationRequest,
): ApprovalAuthorizationDecision {
  const permission = APPROVAL_PERMISSION_MAP[request.action][request.aggregate];
  const accessDecision = evaluateOrganizationAccess({
    subject: request.subject,
    context: request.context,
    permission,
    role: 'Approver',
  });

  if (!accessDecision.organizationScoped) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: 'cross-tenant-access-forbidden',
    };
  }

  if (!accessDecision.hasRequiredRole) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: 'approver-role-required',
    };
  }

  if (!accessDecision.hasRequiredPermission) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: getApprovalPermissionDenyReason(
        request.action,
        request.aggregate,
      ),
    };
  }

  return {
    allowed: true,
    evaluation: accessDecision.evaluation,
  };
}
