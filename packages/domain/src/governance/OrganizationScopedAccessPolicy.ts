import type { PermissionKey } from '../common/permissionKey';
import type { UserRoleName } from '../common/userRoleName';
import type {
  AccessContext,
  AccessPolicyEvaluation,
  AccessSubject,
} from './AccessPolicy';
import { evaluateAccessPolicy } from './AccessPolicy';

export interface OrganizationAccessRequest {
  readonly subject: AccessSubject;
  readonly context: AccessContext;
  readonly permission: PermissionKey;
  readonly role?: UserRoleName;
}

export type OrganizationAccessDenyReason =
  | 'cross-tenant-access-forbidden'
  | 'role-not-granted-in-organization'
  | 'permission-not-granted-in-organization';

export interface OrganizationAccessDecision {
  readonly allowed: boolean;
  readonly organizationScoped: boolean;
  readonly hasRequiredRole: boolean;
  readonly hasRequiredPermission: boolean;
  readonly evaluation: AccessPolicyEvaluation;
  readonly denyReason?: OrganizationAccessDenyReason;
}

function deriveOrganizationAccessDenyReason(
  evaluation: AccessPolicyEvaluation,
): OrganizationAccessDenyReason | undefined {
  if (!evaluation.organizationScoped) {
    return 'cross-tenant-access-forbidden';
  }

  if (!evaluation.hasRequiredRole) {
    return 'role-not-granted-in-organization';
  }

  if (!evaluation.hasRequiredPermission) {
    return 'permission-not-granted-in-organization';
  }

  return undefined;
}

export function evaluateOrganizationAccess(
  request: OrganizationAccessRequest,
): OrganizationAccessDecision {
  const evaluation = evaluateAccessPolicy(
    request.subject,
    request.context,
    request.permission,
    request.role,
  );

  return {
    allowed: evaluation.allowed,
    organizationScoped: evaluation.organizationScoped,
    hasRequiredRole: evaluation.hasRequiredRole,
    hasRequiredPermission: evaluation.hasRequiredPermission,
    evaluation,
    denyReason: deriveOrganizationAccessDenyReason(evaluation),
  };
}
