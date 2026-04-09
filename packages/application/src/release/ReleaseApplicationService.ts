import {
  AuditOperation,
  AuditReleaseType,
  type AuditRecordEvent,
  type ReleaseAuditEvent,
} from '../../../domain/src/shared/audit';
import type { ApprovalStatus, ContentPackage } from '../../../domain/src/content/entities';
import { ApprovalStatus as LifecycleApprovalStatus } from '../../../domain/src/lifecycle/entities/ApprovalStatus';
import type { ContentEntityLifecycleState } from '../../../domain/src/lifecycle/entities/ContentLifecycle';
import {
  transitionLifecycle,
  type LifecycleTransitionAllowedResult,
} from '../../../domain/src/lifecycle/services';
import {
  ReleaseEngine,
  type ReleaseCompositionApprovalEntry,
} from '../../../domain/src/release/services/ReleaseEngine';
import type {
  ContentPackageId,
  OrgId,
  ReleaseVersionRecordId,
  UserId,
  UserRoleId,
  VersionId,
} from '../../../domain/src/shared/types';
import {
  ReleaseType,
  type ContentEntityType,
  type ContentPackageVersion,
  type ReleaseVersion,
} from '../../../domain/src/versioning/entities';
import type { ReleaseContentPackageCommand } from './ReleaseContentPackageCommand';
import type {
  ContentEntityVersionRepository,
  ContentPackageRepository,
  ReleaseVersionRepository,
} from './ports';

export interface ContentEntityStateRepository {
  findApprovalState(
    entityId: string,
    entityType: ContentEntityType,
    organizationId: OrgId,
  ): Promise<{
    readonly approvalStatus: ApprovalStatus;
    readonly currentVersionId: VersionId;
    readonly organizationId: OrgId;
  } | null>;
}

export interface ReleaseActorRoleResolver {
  resolveReleasedBy(
    actorUserId: UserId,
    organizationId: OrgId,
  ): Promise<UserRoleId>;
}

export interface PreparedReleaseLifecycleTransition {
  readonly entityId: string;
  readonly entityType: ContentEntityType;
  readonly transition: LifecycleTransitionAllowedResult;
}

export interface ReleaseApplicationServiceResult {
  readonly releaseVersion: ReleaseVersion;
  readonly auditRecord: AuditRecordEvent;
  readonly compositionEntries: ReadonlyArray<ReleaseCompositionApprovalEntry>;
  readonly lifecycleTransitions: ReadonlyArray<PreparedReleaseLifecycleTransition>;
}

export interface ReleaseApplicationServiceDependencies {
  readonly contentPackageRepository: ContentPackageRepository;
  readonly contentEntityVersionRepository: ContentEntityVersionRepository;
  readonly contentEntityStateRepository: ContentEntityStateRepository;
  readonly releaseVersionRepository: ReleaseVersionRepository;
  readonly actorRoleResolver: ReleaseActorRoleResolver;
  readonly engine: ReleaseEngine;
  readonly createReleaseVersionId: () => ReleaseVersionRecordId;
  readonly createAuditEventId: () => string;
  readonly now?: () => Date;
}

export class ReleaseApplicationService {
  private readonly now: () => Date;

  public constructor(
    private readonly dependencies: ReleaseApplicationServiceDependencies,
  ) {
    this.now = dependencies.now ?? (() => new Date());
  }

  public async execute(
    command: ReleaseContentPackageCommand,
  ): Promise<ReleaseApplicationServiceResult> {
    const contentPackage = await this.requireContentPackage(command);
    const packageVersion = await this.requirePackageVersion(command, contentPackage);
    const compositionEntries = await this.resolveCompositionEntries(
      packageVersion,
      command.organizationId,
    );
    const activeRelease = await this.dependencies.releaseVersionRepository.findActive(
      command.packageId,
      command.organizationId,
    );
    const releasedAt = this.now();
    const releasedBy = await this.dependencies.actorRoleResolver.resolveReleasedBy(
      command.actorUserId,
      command.organizationId,
    );

    const releaseVersion = this.dependencies.engine.createRelease({
      id: this.dependencies.createReleaseVersionId(),
      contentPackage,
      packageVersion,
      compositionEntries,
      releasedAt,
      releasedBy,
      activeRelease,
      rollbackSourceVersionId: command.rollbackSourceVersionId ?? null,
    });

    const auditRecord = createReleaseAuditRecord({
      auditEventId: this.dependencies.createAuditEventId(),
      actorUserId: command.actorUserId,
      actorRoleId: releasedBy,
      releaseVersion,
      packageVersion,
    });

    return Object.freeze({
      releaseVersion,
      auditRecord,
      compositionEntries: Object.freeze([...compositionEntries]),
      lifecycleTransitions: Object.freeze(
        this.prepareLifecycleTransitions(
          packageVersion,
          compositionEntries,
          command,
          releasedBy,
        ),
      ),
    });
  }

  private async requireContentPackage(
    command: ReleaseContentPackageCommand,
  ): Promise<ContentPackage> {
    const contentPackage =
      await this.dependencies.contentPackageRepository.findById(
        command.packageId,
        command.organizationId,
      );

    if (contentPackage == null) {
      throw new Error(
        `ContentPackage ${command.packageId} not found in organization ${command.organizationId}.`,
      );
    }

    return contentPackage;
  }

  private async requirePackageVersion(
    command: ReleaseContentPackageCommand,
    contentPackage: ContentPackage,
  ): Promise<ContentPackageVersion> {
    const packageVersion =
      await this.dependencies.contentEntityVersionRepository.findById(
        command.packageVersionId,
        command.organizationId,
      );

    if (packageVersion == null) {
      throw new Error(
        `ContentPackageVersion ${command.packageVersionId} not found in organization ${command.organizationId}.`,
      );
    }

    if (packageVersion.packageId !== contentPackage.id) {
      throw new Error(
        `ContentPackageVersion ${command.packageVersionId} does not belong to ContentPackage ${contentPackage.id}.`,
      );
    }

    return packageVersion;
  }

  private async resolveCompositionEntries(
    packageVersion: ContentPackageVersion,
    organizationId: OrgId,
  ): Promise<ReadonlyArray<ReleaseCompositionApprovalEntry>> {
    const entries = await Promise.all(
      packageVersion.composition.map(async (entry) => {
        const state =
          await this.dependencies.contentEntityStateRepository.findApprovalState(
            entry.entityId,
            entry.entityType,
            organizationId,
          );

        if (state == null) {
          throw new Error(
            `Approval state for ${entry.entityType} ${entry.entityId} could not be resolved.`,
          );
        }

        return Object.freeze({
          entityId: entry.entityId,
          organizationId: state.organizationId,
          approvalStatus: state.approvalStatus,
          versionId: entry.versionId,
          currentVersionId: state.currentVersionId,
        });
      }),
    );

    return Object.freeze(entries);
  }

  private prepareLifecycleTransitions(
    packageVersion: ContentPackageVersion,
    compositionEntries: ReadonlyArray<ReleaseCompositionApprovalEntry>,
    command: ReleaseContentPackageCommand,
    actorRoleId: UserRoleId,
  ): ReadonlyArray<PreparedReleaseLifecycleTransition> {
    return packageVersion.composition.map((entry) => {
      const resolvedEntry = compositionEntries.find(
        (candidate) => candidate.entityId === entry.entityId,
      );

      if (resolvedEntry == null) {
        throw new Error(
          `Resolved composition entry for ${entry.entityType} ${entry.entityId} is missing.`,
        );
      }

      const state: ContentEntityLifecycleState = {
        aggregate: 'ContentEntity',
        organizationId: resolvedEntry.organizationId as OrgId,
        approvalStatus: resolvedEntry.approvalStatus,
        currentVersionId: resolvedEntry.currentVersionId,
        entityType: entry.entityType,
        entityId: entry.entityId as ContentEntityLifecycleState['entityId'],
      };

      const transition = transitionLifecycle({
        state,
        targetStatus: LifecycleApprovalStatus.Released,
        actor: {
          organizationId: command.organizationId,
          userId: command.actorUserId,
          roleId: actorRoleId,
        },
        auditEventId: this.dependencies.createAuditEventId(),
        organizationIsActive: true,
        viaContentPackageRelease: true,
      });

      if (!transition.allowed) {
        throw new Error(
          `Lifecycle release transition denied for ${entry.entityType} ${entry.entityId}: ${transition.decision.denyReason}.`,
        );
      }

      return Object.freeze({
        entityId: entry.entityId,
        entityType: entry.entityType,
        transition,
      });
    });
  }
}

interface CreateReleaseAuditRecordInput {
  readonly auditEventId: string;
  readonly actorUserId: UserId;
  readonly actorRoleId: UserRoleId;
  readonly releaseVersion: ReleaseVersion;
  readonly packageVersion: ContentPackageVersion;
}

function createReleaseAuditRecord(
  input: CreateReleaseAuditRecordInput,
): AuditRecordEvent {
  const releaseType = mapAuditReleaseType(input.releaseVersion.releaseType);

  return Object.freeze({
    id: input.auditEventId,
    eventType: 'release',
    organizationId: input.releaseVersion.organizationId,
    actorUserId: input.actorUserId as ReleaseAuditEvent['actorUserId'],
    actorRoleId: input.actorRoleId,
    operation:
      input.releaseVersion.releaseType === ReleaseType.ROLLBACK
        ? AuditOperation.Rollback
        : AuditOperation.Release,
    targetEntityType: 'ContentPackage',
    targetEntityId: input.releaseVersion.packageId,
    releaseVersionId: input.releaseVersion.id as unknown as VersionId,
    packageVersionId: input.releaseVersion.packageVersionId,
    packageId: input.releaseVersion.packageId as ContentPackageId,
    regionId: input.releaseVersion.regionId,
    releasedBy: input.releaseVersion.releasedBy,
    releasedAt: input.releaseVersion.releasedAt.toISOString(),
    targetScope: Object.freeze({ ...input.releaseVersion.targetScope }),
    applicabilityScopes: Object.freeze(
      input.packageVersion.applicabilityScopes.map((scope) => Object.freeze({ ...scope })),
    ),
    excludedScopes: Object.freeze(
      input.packageVersion.excludedScopes.map((scope) => Object.freeze({ ...scope })),
    ),
    releaseType,
    compositionSnapshot: Object.freeze(
      input.releaseVersion.compositionSnapshot.map((entry) => Object.freeze({ ...entry })),
    ),
    supersededReleaseId:
      input.releaseVersion.supersededReleaseId as unknown as VersionId | null,
    rollbackSourceVersionId: input.releaseVersion.rollbackSourceVersionId,
  });
}

function mapAuditReleaseType(
  releaseType: ReleaseVersion['releaseType'],
): ReleaseAuditEvent['releaseType'] {
  switch (releaseType) {
    case ReleaseType.INITIAL:
      return AuditReleaseType.INITIAL;
    case ReleaseType.UPDATE:
      return AuditReleaseType.UPDATE;
    case ReleaseType.ROLLBACK:
      return AuditReleaseType.ROLLBACK;
    default:
      throw new Error(`Unsupported release type: ${String(releaseType)}`);
  }
}
