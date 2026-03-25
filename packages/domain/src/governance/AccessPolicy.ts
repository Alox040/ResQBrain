import type { PermissionKey } from '../common/permissionKey';
import type { OrganizationContext } from '../common/scope';
import type { UserRoleName } from '../common/userRoleName';

export interface OrganizationRoleAssignment {
  readonly organizationId: OrganizationContext['organizationId'];
  readonly role: UserRoleName;
}

export interface OrganizationPermissionGrant {
  readonly organizationId: OrganizationContext['organizationId'];
  readonly permission: PermissionKey;
}

export interface AccessSubject {
  readonly organizationId: OrganizationContext['organizationId'];
  readonly roles: ReadonlyArray<OrganizationRoleAssignment>;
  readonly permissions: ReadonlyArray<OrganizationPermissionGrant>;
}

export type AccessContext = OrganizationContext;

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
  role: UserRoleName,
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
  permission: PermissionKey,
  context: AccessContext,
): boolean {
  return subject.permissions.some(
    (grant) =>
      grant.organizationId === context.organizationId &&
      grant.permission === permission,
  );
}

/**
 * Evaluates tenant-scoped access. Permission is always required in the active organization.
 *
 * @param requiredRole When set, the subject must also hold this role in the same organization.
 *   When omitted, no role check is performed (permission-only mode). Callers that must enforce
 *   role gating should pass an explicit role.
 */
export function evaluateAccessPolicy(
  subject: AccessSubject,
  context: AccessContext,
  permission: PermissionKey,
  requiredRole?: UserRoleName,
): AccessPolicyEvaluation {
  const organizationScoped = isOrganizationScopedAccess(subject, context);
  const hasRequiredRole =
    requiredRole === undefined ||
    hasRoleInOrganization(subject, requiredRole, context);
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

/**
 * @param requiredRole Same semantics as {@link evaluateAccessPolicy}.
 */
export function assertAccessPolicy(
  subject: AccessSubject,
  context: AccessContext,
  permission: PermissionKey,
  requiredRole?: UserRoleName,
): AccessPolicyEvaluation {
  const evaluation = evaluateAccessPolicy(
    subject,
    context,
    permission,
    requiredRole,
  );

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
