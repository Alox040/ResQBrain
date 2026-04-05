import {
  AuditOperation,
  AuditReleaseType,
  type ReleaseAuditEvent,
} from '../shared/audit';
import {
  allow,
  deny,
  DenyReason,
  type AllowedPolicyDecision,
  type ContentPackageId,
  type DeniedPolicyDecision,
  type OrgId,
  type UserRoleId,
  type VersionId,
} from '../shared/types';
import { ApprovalStatus, type ContentPackage, isContentPackageImmutable } from '../content/entities';
import { Capability } from '../governance';
import { evaluateCapability } from '../governance/services';
import type { ActorContext } from '../governance/policies/PolicyContext';
import {
  createReleaseVersion,
  markReleaseVersionSuperseded,
  ReleaseType,
  type CompositionEntry,
  type ContentPackageVersion,
  type ReleaseType as ReleaseTypeValue,
  type ReleaseVersion,
} from '../versioning/entities';
import { assertExplicitVersionId } from '../shared/versioning';

export interface ReleaseEntryState {
  readonly entityId: string;
  readonly entityType: CompositionEntry['entityType'];
  readonly organizationId: OrgId;
  readonly versionId: VersionId;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
}

export interface ReleaseContentPackageInput {
  readonly actor: ActorContext;
  readonly organizationId: OrgId | null | undefined;
  readonly regionId?: string | null;
  readonly releaseVersionId: ReleaseVersion['id'];
  readonly auditEventId: string;
  readonly releasedAt: Date;
  readonly versionId: VersionId;
  readonly contentPackage: Pick<
    ContentPackage,
    | 'id'
    | 'organizationId'
    | 'regionId'
    | 'approvalStatus'
    | 'currentVersionId'
    | 'targetScope'
    | 'applicabilityScopes'
    | 'excludedScopes'
  >;
  readonly packageVersion: ContentPackageVersion;
  readonly entries: ReadonlyArray<ReleaseEntryState>;
  readonly activeRelease?: ReleaseVersion | null;
  readonly rollbackSourceVersionId?: VersionId | null;
}

export interface ReleaseDeniedResult {
  readonly allowed: false;
  readonly decision: DeniedPolicyDecision;
  readonly releaseVersion?: undefined;
  readonly supersededRelease?: undefined;
  readonly auditRecord?: undefined;
}

export interface ReleaseAllowedResult {
  readonly allowed: true;
  readonly decision: AllowedPolicyDecision;
  readonly releaseVersion: ReleaseVersion;
  readonly supersededRelease: ReleaseVersion | null;
  readonly auditRecord: Omit<ReleaseAuditEvent, 'timestamp'>;
}

export type ReleaseResult = ReleaseDeniedResult | ReleaseAllowedResult;

export function releaseContentPackage(
  input: ReleaseContentPackageInput,
): ReleaseResult {
  const organizationId = normalizeOrganizationId(input.organizationId);
  if (organizationId == null) {
    return createDeniedResult(
      deny(DenyReason.MISSING_ORGANIZATION_CONTEXT, {
        packageId: input.contentPackage.id,
        versionId: input.versionId,
      }),
    );
  }

  const capabilityDecision = evaluateCapability({
    actor: input.actor,
    organizationId,
    capability: Capability.PACKAGE_RELEASE,
    targetEntity: {
      organizationId: input.contentPackage.organizationId,
      entityId: input.contentPackage.id,
      entityType: 'ContentPackage',
    },
  });

  if (!capabilityDecision.allowed) {
    return createDeniedResult(capabilityDecision);
  }

  if (input.contentPackage.organizationId !== organizationId) {
    return createDeniedResult(
      deny(DenyReason.CROSS_TENANT_ACCESS_DENIED, {
        organizationId,
        contentPackageOrganizationId: input.contentPackage.organizationId,
        packageId: input.contentPackage.id,
      }),
    );
  }

  if (input.packageVersion.organizationId !== organizationId) {
    return createDeniedResult(
      deny(DenyReason.CROSS_TENANT_ACCESS_DENIED, {
        organizationId,
        packageVersionOrganizationId: input.packageVersion.organizationId,
        packageId: input.contentPackage.id,
        versionId: input.packageVersion.id,
      }),
    );
  }

  const explicitVersionId = normalizeExplicitVersionId(input.versionId);
  if (explicitVersionId == null) {
    return createDeniedResult(
      deny(DenyReason.DATA_INTEGRITY_VIOLATION, {
        packageId: input.contentPackage.id,
        versionId: input.versionId ?? null,
      }),
    );
  }

  if (input.packageVersion.id !== explicitVersionId) {
    return createDeniedResult(
      deny(DenyReason.DATA_INTEGRITY_VIOLATION, {
        packageId: input.contentPackage.id,
        versionId: explicitVersionId,
        packageVersionId: input.packageVersion.id,
      }),
    );
  }

  const releaseType = determineReleaseType(
    explicitVersionId,
    input.contentPackage.currentVersionId,
    input.activeRelease ?? null,
    input.rollbackSourceVersionId ?? null,
  );

  if (releaseType == null) {
    return createDeniedResult(
      deny(DenyReason.COMPOSITION_VERSION_STALE, {
        packageId: input.contentPackage.id,
        versionId: explicitVersionId,
        currentVersionId: input.contentPackage.currentVersionId,
      }),
    );
  }

  if (input.contentPackage.approvalStatus !== ApprovalStatus.Approved) {
    return createDeniedResult(
      deny(DenyReason.PACKAGE_NOT_APPROVED, {
        packageId: input.contentPackage.id,
        packageApprovalStatus: input.contentPackage.approvalStatus,
        versionId: explicitVersionId,
      }),
    );
  }

  if (
    releaseType !== ReleaseType.ROLLBACK &&
    isContentPackageImmutable(input.contentPackage)
  ) {
    return createDeniedResult(
      deny(DenyReason.ENTITY_IMMUTABLE, {
        packageId: input.contentPackage.id,
        approvalStatus: input.contentPackage.approvalStatus,
      }),
    );
  }

  for (const entry of input.entries) {
    if (entry.organizationId !== organizationId) {
      return createDeniedResult(
        deny(DenyReason.CROSS_TENANT_COMPOSITION_ENTRY, {
          packageId: input.contentPackage.id,
          entityId: entry.entityId,
          organizationId,
          entryOrganizationId: entry.organizationId,
        }),
      );
    }

    if (
      entry.approvalStatus !== ApprovalStatus.Approved &&
      entry.approvalStatus !== ApprovalStatus.Released
    ) {
      return createDeniedResult(
        deny(DenyReason.COMPOSITION_ENTRY_NOT_APPROVED, {
          packageId: input.contentPackage.id,
          entityId: entry.entityId,
          approvalStatus: entry.approvalStatus,
        }),
      );
    }

    if (entry.versionId !== entry.currentVersionId) {
      return createDeniedResult(
        deny(DenyReason.COMPOSITION_VERSION_STALE, {
          packageId: input.contentPackage.id,
          entityId: entry.entityId,
          versionId: entry.versionId,
          currentVersionId: entry.currentVersionId,
        }),
      );
    }
  }

  const actorRoleId = resolveActorRoleId(capabilityDecision.context.grantingRoleIds);
  const regionId = resolveRegionId(input.regionId, input.contentPackage.regionId);
  const supersededRelease =
    input.activeRelease == null ? null : markReleaseVersionSuperseded(input.activeRelease);
  const releaseVersion = createReleaseVersion({
    id: input.releaseVersionId,
    organizationId,
    regionId,
    packageVersionId: explicitVersionId,
    packageId: input.contentPackage.id,
    releasedAt: input.releasedAt,
    releasedBy: actorRoleId,
    targetScope: input.packageVersion.targetScope,
    releaseType,
    supersededReleaseId: supersededRelease?.id ?? null,
    rollbackSourceVersionId:
      releaseType === ReleaseType.ROLLBACK ? explicitVersionId : null,
    compositionSnapshot: input.packageVersion.composition,
  });

  return Object.freeze({
    allowed: true,
    decision: allow({
      context: {
        organizationId,
        packageId: input.contentPackage.id,
        packageVersionId: explicitVersionId,
        releaseVersionId: releaseVersion.id,
        releaseType,
      },
    }),
    releaseVersion,
    supersededRelease,
    auditRecord: createReleaseAuditRecord(
      input,
      actorRoleId,
      releaseVersion,
      releaseType,
    ),
  });
}

function determineReleaseType(
  versionId: VersionId,
  currentVersionId: VersionId,
  activeRelease: ReleaseVersion | null,
  rollbackSourceVersionId: VersionId | null,
): ReleaseTypeValue | null {
  if (rollbackSourceVersionId != null) {
    return rollbackSourceVersionId === versionId ? ReleaseType.ROLLBACK : null;
  }

  if (versionId !== currentVersionId) {
    return null;
  }

  if (activeRelease == null) {
    return ReleaseType.INITIAL;
  }

  return ReleaseType.UPDATE;
}

function createReleaseAuditRecord(
  input: ReleaseContentPackageInput,
  actorRoleId: UserRoleId,
  releaseVersion: ReleaseVersion,
  releaseType: ReleaseTypeValue,
): Omit<ReleaseAuditEvent, 'timestamp'> {
  return Object.freeze({
    id: input.auditEventId,
    eventType: 'release',
    organizationId: releaseVersion.organizationId,
    actorUserId: input.actor.userId as ReleaseAuditEvent['actorUserId'],
    actorRoleId,
    operation:
      releaseType === ReleaseType.ROLLBACK
        ? AuditOperation.Rollback
        : AuditOperation.Release,
    targetEntityType: 'ContentPackage',
    targetEntityId: releaseVersion.packageId,
    releaseVersionId: releaseVersion.id as unknown as VersionId,
    packageVersionId: releaseVersion.packageVersionId,
    packageId: releaseVersion.packageId,
    regionId: releaseVersion.regionId,
    releasedBy: actorRoleId,
    releasedAt: releaseVersion.releasedAt.toISOString(),
    targetScope: Object.freeze({ ...releaseVersion.targetScope }),
    applicabilityScopes: Object.freeze(
      input.packageVersion.applicabilityScopes.map((scope) => Object.freeze({ ...scope })),
    ),
    excludedScopes: Object.freeze(
      input.packageVersion.excludedScopes.map((scope) => Object.freeze({ ...scope })),
    ),
    releaseType: mapAuditReleaseType(releaseType),
    compositionSnapshot: Object.freeze(
      releaseVersion.compositionSnapshot.map((entry) => Object.freeze({ ...entry })),
    ),
    supersededReleaseId:
      releaseVersion.supersededReleaseId as unknown as VersionId | null,
    rollbackSourceVersionId: releaseVersion.rollbackSourceVersionId,
  });
}

function mapAuditReleaseType(releaseType: ReleaseTypeValue): ReleaseAuditEvent['releaseType'] {
  switch (releaseType) {
    case ReleaseType.INITIAL:
      return AuditReleaseType.INITIAL;
    case ReleaseType.UPDATE:
      return AuditReleaseType.UPDATE;
    case ReleaseType.ROLLBACK:
      return AuditReleaseType.ROLLBACK;
  }
}

function resolveActorRoleId(value: unknown): UserRoleId {
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value[0] as UserRoleId;
  }

  throw new Error('Permission decision must include at least one grantingRoleId.');
}

function normalizeOrganizationId(
  organizationId: OrgId | null | undefined,
): OrgId | null {
  if (typeof organizationId !== 'string') {
    return null;
  }

  const normalized = organizationId.trim();
  return normalized.length > 0 ? (normalized as OrgId) : null;
}

function normalizeExplicitVersionId(
  versionId: VersionId | null | undefined,
): VersionId | null {
  if (typeof versionId !== 'string') {
    return null;
  }

  const normalized = versionId.trim();
  if (normalized.length === 0) {
    return null;
  }

  const versionCheck = assertExplicitVersionId(normalized.toLowerCase());
  if (!versionCheck.allowed) {
    return null;
  }

  return normalized as VersionId;
}

function resolveRegionId(
  inputRegionId: string | null | undefined,
  packageRegionId: string | null,
): string | null {
  if (inputRegionId === undefined) {
    return packageRegionId;
  }

  if (typeof inputRegionId === 'string' && inputRegionId.trim().length > 0) {
    return inputRegionId.trim();
  }

  return null;
}

function createDeniedResult(decision: DeniedPolicyDecision): ReleaseDeniedResult {
  return Object.freeze({
    allowed: false,
    decision,
  });
}
