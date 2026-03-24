import type { OrganizationId } from '../common/ids';
import type {
  TransitionPolicyPermission,
  TransitionPolicyRole,
} from '../lifecycle/TransitionPolicy';

export interface OrganizationRoleAssignment {
  readonly organizationId: OrganizationId;
  readonly role: TransitionPolicyRole;
}

export interface OrganizationPermissionGrant {
  readonly organizationId: OrganizationId;
  readonly permission: TransitionPolicyPermission;
}

export interface AccessSubject {
  readonly organizationId: OrganizationId;
  readonly roles: ReadonlyArray<OrganizationRoleAssignment>;
  readonly permissions: ReadonlyArray<OrganizationPermissionGrant>;
}

export interface AccessContext {
  readonly organizationId: OrganizationId;
}

export interface AccessPolicyEvaluation {
  readonly allowed: boolean;
  readonly organizationScoped: boolean;
  readonly hasRequiredRole: boolean;
  readonly hasRequiredPermission: boolean;
}

export const ACCESS_POLICY_ERROR_CODES = [
  'cross-tenant-access-forbidden',
  'role-not-granted-in-organization',
  'permission-not-granted-in-organization',
] as const;

export type AccessPolicyErrorCode =
  (typeof ACCESS_POLICY_ERROR_CODES)[number];

export class AccessPolicyError extends Error {
  readonly code: AccessPolicyErrorCode;

  constructor(code: AccessPolicyErrorCode) {
    super(code);
    this.name = 'AccessPolicyError';
    this.code = code;
  }
}

export function isOrganizationScopedAccess(
  subject: AccessSubject,
  context: AccessContext,
): boolean {
  return subject.organizationId === context.organizationId;
}

export function hasRoleInOrganization(
  subject: AccessSubject,
  role: TransitionPolicyRole,
  context: AccessContext,
): boolean {
  return subject.roles.some(
    (assignment) =>
      assignment.organizationId === context.organizationId &&
      assignment.role === role,
  );
}

export function hasPermissionInOrganization(
  subject: AccessSubject,
  permission: TransitionPolicyPermission,
  context: AccessContext,
): boolean {
  return subject.permissions.some(
    (grant) =>
      grant.organizationId === context.organizationId &&
      grant.permission === permission,
  );
}

export function evaluateAccessPolicy(
  subject: AccessSubject,
  context: AccessContext,
  permission: TransitionPolicyPermission,
  role?: TransitionPolicyRole,
): AccessPolicyEvaluation {
  const organizationScoped = isOrganizationScopedAccess(subject, context);
  const hasRequiredRole =
    role === undefined || hasRoleInOrganization(subject, role, context);
  const hasRequiredPermission = hasPermissionInOrganization(
    subject,
    permission,
    context,
  );

  return {
    allowed: organizationScoped && hasRequiredRole && hasRequiredPermission,
    organizationScoped,
    hasRequiredRole,
    hasRequiredPermission,
  };
}

export function assertAccessPolicy(
  subject: AccessSubject,
  context: AccessContext,
  permission: TransitionPolicyPermission,
  role?: TransitionPolicyRole,
): AccessPolicyEvaluation {
  const evaluation = evaluateAccessPolicy(subject, context, permission, role);

  if (!evaluation.organizationScoped) {
    throw new AccessPolicyError('cross-tenant-access-forbidden');
  }

  if (!evaluation.hasRequiredRole) {
    throw new AccessPolicyError('role-not-granted-in-organization');
  }

  if (!evaluation.hasRequiredPermission) {
    throw new AccessPolicyError('permission-not-granted-in-organization');
  }

  return evaluation;
}
