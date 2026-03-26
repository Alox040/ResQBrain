import type {
  ApprovalPolicyId,
  CountyId,
  OrgId,
  RegionId,
  StationId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';
import type { EntityType } from '../../versioning/entities';
import { EntityType as EntityTypeValue } from '../../versioning/entities';
import type { QuorumType } from './QuorumType';
import { RoleType } from './RoleType';
import type { RoleType as RoleTypeValue } from './RoleType';

export const EscalationPolicy = {
  NONE: 'None',
  NOTIFY_ORG_ADMIN: 'NotifyOrgAdmin',
} as const;

export type EscalationPolicy =
  (typeof EscalationPolicy)[keyof typeof EscalationPolicy];

export type ApprovalPolicyScopeTargetId = RegionId | CountyId | StationId;

export interface ApprovalPolicy {
  readonly id: ApprovalPolicyId;
  readonly organizationId: OrgId;
  readonly appliesTo: EntityType;
  readonly scopeLevel: ScopeLevel;
  readonly scopeTargetId: ApprovalPolicyScopeTargetId | null;
  readonly priority: number;
  readonly eligibleRoles: ReadonlyArray<RoleTypeValue>;
  readonly minimumReviewers: number;
  readonly quorumType: QuorumType;
  readonly requireSeparationOfDuty: boolean;
  readonly allowSelfReview: false;
  readonly requireRationale: true;
  readonly reviewWindowDays: number | null;
  readonly escalationPolicy: EscalationPolicy;
}

export interface CreateApprovalPolicyInput {
  readonly id: ApprovalPolicyId;
  readonly organizationId: OrgId;
  readonly appliesTo: EntityType;
  readonly scopeLevel?: ScopeLevel;
  readonly scopeTargetId?: ApprovalPolicyScopeTargetId | null;
  readonly priority?: number;
  readonly eligibleRoles: ReadonlyArray<RoleTypeValue>;
  readonly minimumReviewers: number;
  readonly quorumType: QuorumType;
  readonly requireSeparationOfDuty: boolean;
  readonly allowSelfReview?: false;
  readonly requireRationale?: true;
  readonly reviewWindowDays?: number | null;
  readonly escalationPolicy?: EscalationPolicy;
}

export function createApprovalPolicy(
  input: CreateApprovalPolicyInput,
): ApprovalPolicy {
  const scopeLevel = input.scopeLevel ?? ScopeLevel.ORGANIZATION;

  if (!Number.isInteger(input.minimumReviewers) || input.minimumReviewers < 1) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ApprovalPolicy.minimumReviewers must be greater than or equal to 1.',
    );
  }

  if (
    input.appliesTo === EntityTypeValue.ContentPackage &&
    input.requireSeparationOfDuty !== true
  ) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ContentPackage approval policies must require separation of duty.',
    );
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

function normalizePriority(value: number | undefined): number {
  if (value == null) {
    return 0;
  }

  if (!Number.isInteger(value)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ApprovalPolicy.priority must be an integer.',
    );
  }

  return value;
}

function freezeEligibleRoles(
  roles: ReadonlyArray<RoleTypeValue>,
): ReadonlyArray<RoleTypeValue> {
  if (!Array.isArray(roles) || roles.length === 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ApprovalPolicy.eligibleRoles must contain at least one role.',
    );
  }

  const uniqueRoles = Array.from(new Set(roles));

  return Object.freeze(
    uniqueRoles.map((role) => {
      if (!Object.values(RoleType).includes(role)) {
        throw new DomainError(
          'DATA_INTEGRITY_VIOLATION',
          'ApprovalPolicy.eligibleRoles contains an invalid role type.',
          { role },
        );
      }

      return role;
    }),
  );
}

function normalizeScopeTarget(
  scopeLevel: ScopeLevel,
  scopeTargetId: ApprovalPolicyScopeTargetId | null | undefined,
): ApprovalPolicyScopeTargetId | null {
  if (scopeLevel === ScopeLevel.ORGANIZATION) {
    if (scopeTargetId != null) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'Organization-scoped ApprovalPolicy must not define scopeTargetId.',
      );
    }

    return null;
  }

  return assertNonEmptyId(
    scopeTargetId as ApprovalPolicyScopeTargetId,
    'ApprovalPolicy.scopeTargetId',
  );
}

function normalizeReviewWindowDays(value: number | null | undefined): number | null {
  if (value == null) {
    return null;
  }

  if (!Number.isInteger(value) || value < 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ApprovalPolicy.reviewWindowDays must be a non-negative integer.',
    );
  }

  return value;
}

function assertEntityType(value: EntityType): EntityType {
  return assertNonEmptyId(value, 'ApprovalPolicy.appliesTo');
}

function assertOrgId(value: OrgId): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'ApprovalPolicy.organizationId is required.',
    );
  }

  return value;
}

function assertNonEmptyId<TValue extends string>(value: TValue, field: string): TValue {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
      field,
    });
  }

  return value;
}
