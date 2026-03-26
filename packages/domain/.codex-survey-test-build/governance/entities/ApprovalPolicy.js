import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';
import { EntityType as EntityTypeValue } from '../../versioning/entities';
import { RoleType } from './RoleType';
export const EscalationPolicy = {
    NONE: 'None',
    NOTIFY_ORG_ADMIN: 'NotifyOrgAdmin',
};
export function createApprovalPolicy(input) {
    const scopeLevel = input.scopeLevel ?? ScopeLevel.ORGANIZATION;
    if (!Number.isInteger(input.minimumReviewers) || input.minimumReviewers < 1) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'ApprovalPolicy.minimumReviewers must be greater than or equal to 1.');
    }
    if (input.appliesTo === EntityTypeValue.ContentPackage &&
        input.requireSeparationOfDuty !== true) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'ContentPackage approval policies must require separation of duty.');
    }
    return Object.freeze({
        id: assertNonEmptyId(input.id, 'ApprovalPolicy.id'),
        organizationId: assertOrgId(input.organizationId),
        appliesTo: assertEntityType(input.appliesTo),
        scopeLevel,
        scopeTargetId: normalizeScopeTarget(scopeLevel, input.scopeTargetId),
        priority: normalizePriority(input.priority),
        eligibleRoles: freezeEligibleRoles(input.eligibleRoles),
        minimumReviewers: input.minimumReviewers,
        quorumType: input.quorumType,
        requireSeparationOfDuty: input.requireSeparationOfDuty,
        allowSelfReview: false,
        requireRationale: true,
        reviewWindowDays: normalizeReviewWindowDays(input.reviewWindowDays),
        escalationPolicy: input.escalationPolicy ?? EscalationPolicy.NONE,
    });
}
function normalizePriority(value) {
    if (value == null) {
        return 0;
    }
    if (!Number.isInteger(value)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'ApprovalPolicy.priority must be an integer.');
    }
    return value;
}
function freezeEligibleRoles(roles) {
    if (!Array.isArray(roles) || roles.length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'ApprovalPolicy.eligibleRoles must contain at least one role.');
    }
    const uniqueRoles = Array.from(new Set(roles));
    return Object.freeze(uniqueRoles.map((role) => {
        if (!Object.values(RoleType).includes(role)) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'ApprovalPolicy.eligibleRoles contains an invalid role type.', { role });
        }
        return role;
    }));
}
function normalizeScopeTarget(scopeLevel, scopeTargetId) {
    if (scopeLevel === ScopeLevel.ORGANIZATION) {
        if (scopeTargetId != null) {
            throw new DomainError('DATA_INTEGRITY_VIOLATION', 'Organization-scoped ApprovalPolicy must not define scopeTargetId.');
        }
        return null;
    }
    return assertNonEmptyId(scopeTargetId, 'ApprovalPolicy.scopeTargetId');
}
function normalizeReviewWindowDays(value) {
    if (value == null) {
        return null;
    }
    if (!Number.isInteger(value) || value < 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'ApprovalPolicy.reviewWindowDays must be a non-negative integer.');
    }
    return value;
}
function assertEntityType(value) {
    return assertNonEmptyId(value, 'ApprovalPolicy.appliesTo');
}
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', 'ApprovalPolicy.organizationId is required.');
    }
    return value;
}
function assertNonEmptyId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
            field,
        });
    }
    return value;
}
