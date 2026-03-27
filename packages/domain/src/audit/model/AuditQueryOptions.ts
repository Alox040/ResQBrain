import type { AuditOperation } from '../../shared/audit/AuditOperation';
import type { OrgId } from '../../shared/types';

import { DomainError, TenantIsolationViolation } from '../../shared/errors';

export interface AuditQueryOptions {
  readonly from?: string;
  readonly to?: string;
  /** Event discriminant filter (e.g. `lifecycle`, `release`). */
  readonly eventType?: string;
  readonly operation?: AuditOperation;
  readonly limit?: number;
  readonly offset?: number;
}

export function createAuditQueryOptions(
  options: AuditQueryOptions = {},
): AuditQueryOptions {
  const from = normalizeIsoTimestamp(options.from, 'AuditQueryOptions.from');
  const to = normalizeIsoTimestamp(options.to, 'AuditQueryOptions.to');

  if (from != null && to != null && from > to) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'AuditQueryOptions.from must be less than or equal to AuditQueryOptions.to.',
    );
  }

  const limit = normalizePositiveInteger(options.limit, 'AuditQueryOptions.limit');
  const offset = normalizeNonNegativeInteger(options.offset, 'AuditQueryOptions.offset');

  const eventType =
    options.eventType == null
      ? undefined
      : normalizeNonEmptyString(options.eventType, 'AuditQueryOptions.eventType');

  return Object.freeze({
    ...(from == null ? {} : { from }),
    ...(to == null ? {} : { to }),
    ...(eventType == null ? {} : { eventType }),
    ...(options.operation == null ? {} : { operation: options.operation }),
    ...(limit == null ? {} : { limit }),
    ...(offset == null ? {} : { offset }),
  });
}

export function requireAuditOrganizationId(
  organizationId: OrgId | null | undefined,
): OrgId {
  if (typeof organizationId !== 'string' || organizationId.trim().length === 0) {
    throw new TenantIsolationViolation(
      'Audit queries require an explicit organizationId.',
    );
  }

  return organizationId;
}

export function assertAuditEntryOrganization(
  requestedOrganizationId: OrgId,
  entryOrganizationId: OrgId,
): void {
  if (requestedOrganizationId !== entryOrganizationId) {
    throw new TenantIsolationViolation(
      'Cross-tenant audit access is prohibited.',
      {
        requestedOrganizationId,
        entryOrganizationId,
      },
    );
  }
}

function normalizeNonEmptyString(
  value: string,
  field: string,
): string {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a non-empty string.`, {
      field,
    });
  }

  return trimmed;
}

function normalizeIsoTimestamp(
  value: string | undefined,
  field: string,
): string | undefined {
  if (value == null) {
    return undefined;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a non-empty ISO timestamp.`, {
      field,
    });
  }

  const timestamp = value.trim();

  if (Number.isNaN(Date.parse(timestamp))) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a valid ISO timestamp.`, {
      field,
    });
  }

  return timestamp;
}

function normalizePositiveInteger(
  value: number | undefined,
  field: string,
): number | undefined {
  if (value == null) {
    return undefined;
  }

  if (!Number.isInteger(value) || value <= 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} must be a positive integer.`,
      { field },
    );
  }

  return value;
}

function normalizeNonNegativeInteger(
  value: number | undefined,
  field: string,
): number | undefined {
  if (value == null) {
    return undefined;
  }

  if (!Number.isInteger(value) || value < 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} must be a non-negative integer.`,
      { field },
    );
  }

  return value;
}
