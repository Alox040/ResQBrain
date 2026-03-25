import type { OrgId } from '../../shared/types';

import { DomainError } from '../../shared/errors';
import { OrganizationStatus } from './OrganizationStatus';

export interface OrganizationAuditEntry {
  readonly changedAt: Date;
  readonly changeType: string;
  readonly rationale: string;
}

export interface Organization {
  readonly id: OrgId;
  readonly name: string;
  readonly slug: string;
  readonly status: OrganizationStatus;
  readonly createdAt: Date;
  readonly auditTrail: ReadonlyArray<OrganizationAuditEntry>;
}

export interface CreateOrganizationInput {
  readonly id: OrgId;
  readonly name: string;
  readonly slug: string;
  readonly status: OrganizationStatus;
  readonly createdAt: Date;
  readonly auditTrail?: ReadonlyArray<OrganizationAuditEntry>;
}

export function createOrganization(
  input: CreateOrganizationInput,
): Organization {
  assertOrgId(input.id);
  assertNonEmptyString(input.name, 'name');
  assertNonEmptyString(input.slug, 'slug');
  assertDate(input.createdAt, 'createdAt');

  const auditTrail = Object.freeze(
    (input.auditTrail ?? []).map((entry) =>
      Object.freeze({
        changedAt: cloneDate(entry.changedAt, 'auditTrail.changedAt'),
        changeType: assertNonEmptyString(entry.changeType, 'auditTrail.changeType'),
        rationale: assertNonEmptyString(entry.rationale, 'auditTrail.rationale'),
      }),
    ),
  );

  return Object.freeze({
    id: input.id,
    name: input.name.trim(),
    slug: input.slug.trim(),
    status: input.status,
    createdAt: cloneDate(input.createdAt, 'createdAt'),
    auditTrail,
  });
}

function assertOrgId(value: OrgId): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'Organization.id is required.',
    );
  }

  return value;
}

function assertNonEmptyString(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
      field,
    });
  }

  return value.trim();
}

function assertDate(value: Date, field: string): Date {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a valid Date.`, {
      field,
    });
  }

  return value;
}

function cloneDate(value: Date, field: string): Date {
  return new Date(assertDate(value, field).getTime());
}
