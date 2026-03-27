import type { AuditableEvent } from '../../shared/audit';
import type { AuditOperation } from '../../shared/audit/AuditOperation';
import type { OrgId, UserId, UserRoleId } from '../../shared/types';

import { DomainError } from '../../shared/errors';

/** Read-model projection for a persisted {@link AuditableEvent} (HC-10). */
export interface AuditLogEntry {
  readonly id: string;
  readonly organizationId: OrgId;
  readonly eventType: string;
  readonly operation: AuditOperation;
  readonly actorUserId: UserId;
  readonly actorRoleId: UserRoleId;
  readonly targetEntityType: string | null;
  readonly targetEntityId: string | null;
  readonly beforeState: unknown;
  readonly afterState: unknown;
  readonly timestamp: string;
  readonly rationale: string | null;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export function createAuditLogEntry(event: AuditableEvent): AuditLogEntry {
  const entry = Object.freeze({
    id: assertNonEmptyId(event.id, 'AuditEvent.id'),
    organizationId: assertOrgId(event.organizationId),
    eventType: event.eventType,
    operation: assertNonEmptyId(event.operation, 'AuditEvent.operation'),
    actorUserId: assertNonEmptyId(event.actorUserId, 'AuditEvent.actorUserId'),
    actorRoleId: assertNonEmptyId(event.actorRoleId, 'AuditEvent.actorRoleId'),
    targetEntityType: assertNullableText(
      event.targetEntityType,
      'AuditEvent.targetEntityType',
    ),
    targetEntityId: assertNullableText(event.targetEntityId, 'AuditEvent.targetEntityId'),
    beforeState: deepFreezeUnknown(resolveBeforeState(event)),
    afterState: deepFreezeUnknown(resolveAfterState(event)),
    timestamp: assertIsoTimestamp(event.timestamp, 'AuditEvent.timestamp'),
    rationale: normalizeOptionalText(resolveRationale(event)),
    metadata: freezeMetadata(event),
  });

  return entry;
}

function resolveBeforeState(event: AuditableEvent): unknown {
  if (event.eventType === 'lifecycle') {
    return event.beforeState ?? event.fromState;
  }

  return event.beforeState ?? null;
}

function resolveAfterState(event: AuditableEvent): unknown {
  if (event.eventType === 'lifecycle') {
    return event.afterState ?? event.toState;
  }

  return event.afterState ?? null;
}

function resolveRationale(event: AuditableEvent): string | null | undefined {
  return event.rationale;
}

function freezeMetadata(event: AuditableEvent): Readonly<Record<string, unknown>> {
  const metadata = {
    ...(isPlainRecord(event.metadata) ? structuredClone(event.metadata) : {}),
    ...buildEventMetadata(event),
  };

  return Object.freeze(
    Object.fromEntries(
      Object.entries(metadata).map(([key, value]) => [key, deepFreezeUnknown(value)]),
    ),
  );
}

function buildEventMetadata(event: AuditableEvent): Record<string, unknown> {
  switch (event.eventType) {
    case 'content_draft_created':
      return {
        versionId: event.versionId,
        initialSnapshot: structuredClone(event.initialSnapshot),
      };
    case 'lifecycle':
      return {
        versionId: event.versionId ?? null,
        capability: event.capability,
      };
    case 'policy_decision':
      return {
        policyType: event.policyType,
        capability: event.capability,
        decision: event.decision,
        denyReason: event.denyReason ?? null,
        warnings: structuredClone(event.warnings),
        evaluationInputs: structuredClone(event.evaluationInputs),
      };
    case 'version_creation':
      return {
        versionId: event.versionId,
        versionNumber: event.versionNumber,
        predecessorVersionId: event.predecessorVersionId ?? null,
        changeReason: event.changeReason ?? null,
        snapshot: structuredClone(event.snapshot),
      };
    case 'release':
      return {
        releaseVersionId: event.releaseVersionId,
        packageVersionId: event.packageVersionId,
        packageId: event.packageId,
        releasedBy: event.releasedBy,
        releasedAt: event.releasedAt,
        targetScope: structuredClone(event.targetScope),
        applicabilityScopes: structuredClone(event.applicabilityScopes ?? []),
        excludedScopes: structuredClone(event.excludedScopes ?? []),
        releaseType: event.releaseType,
        compositionSnapshot: structuredClone(event.compositionSnapshot),
        dependencyWarnings: structuredClone(event.dependencyWarnings ?? []),
        supersededReleaseId: event.supersededReleaseId ?? null,
        rollbackSourceVersionId: event.rollbackSourceVersionId ?? null,
      };
    default:
      return {};
  }
}

function isPlainRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function assertOrgId(value: OrgId): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'AuditEvent.organizationId is required.',
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

function assertNullableText(
  value: string | null | undefined,
  field: string,
): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
      field,
    });
  }

  return value;
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'AuditEvent.rationale must be a non-empty string when provided.',
    );
  }

  return value.trim();
}

function assertIsoTimestamp(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0 || Number.isNaN(Date.parse(value))) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} must be a valid ISO timestamp.`,
      { field },
    );
  }

  return value;
}

function deepFreezeUnknown(value: unknown): unknown {
  if (Array.isArray(value)) {
    return Object.freeze(value.map((entry) => deepFreezeUnknown(structuredClone(entry))));
  }

  if (value instanceof Date) {
    return Object.freeze(new Date(value.getTime()));
  }

  if (value !== null && typeof value === 'object') {
    const clone = structuredClone(value) as Record<string, unknown>;

    for (const [key, propertyValue] of Object.entries(clone)) {
      clone[key] = deepFreezeUnknown(propertyValue);
    }

    return Object.freeze(clone);
  }

  return value;
}
