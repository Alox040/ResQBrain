"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessPolicyError = exports.ACCESS_POLICY_ERROR_CODES = void 0;
exports.isOrganizationScopedAccess = isOrganizationScopedAccess;
exports.hasRoleInOrganization = hasRoleInOrganization;
exports.hasPermissionInOrganization = hasPermissionInOrganization;
exports.evaluateAccessPolicy = evaluateAccessPolicy;
exports.assertAccessPolicy = assertAccessPolicy;
exports.ACCESS_POLICY_ERROR_CODES = [
    'cross-tenant-access-forbidden',
    'role-not-granted-in-organization',
    'permission-not-granted-in-organization',
];
class AccessPolicyError extends Error {
    code;
    constructor(code) {
        super(code);
        this.name = 'AccessPolicyError';
        this.code = code;
    }
}
exports.AccessPolicyError = AccessPolicyError;
function isOrganizationScopedAccess(subject, context) {
    return subject.organizationId === context.organizationId;
}
function hasRoleInOrganization(subject, role, context) {
    return subject.roles.some((assignment) => assignment.organizationId === context.organizationId &&
        assignment.role === role);
}
function hasPermissionInOrganization(subject, permission, context) {
    return subject.permissions.some((grant) => grant.organizationId === context.organizationId &&
        grant.permission === permission);
}
/**
 * Evaluates tenant-scoped access. Permission is always required in the active organization.
 *
 * @param requiredRole When set, the subject must also hold this role in the same organization.
 *   When omitted, no role check is performed (permission-only mode). Callers that must enforce
 *   role gating should pass an explicit role.
 */
function evaluateAccessPolicy(subject, context, permission, requiredRole) {
    const organizationScoped = isOrganizationScopedAccess(subject, context);
    const hasRequiredRole = requiredRole === undefined ||
        hasRoleInOrganization(subject, requiredRole, context);
    const hasRequiredPermission = hasPermissionInOrganization(subject, permission, context);
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
function assertAccessPolicy(subject, context, permission, requiredRole) {
    const evaluation = evaluateAccessPolicy(subject, context, permission, requiredRole);
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
