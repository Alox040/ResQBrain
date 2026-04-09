import {
  ApprovalStatus,
  type ContentPackage as CanonicalContentPackage,
} from '../../content/entities';
import { DomainError } from '../../shared/errors';
import type { ReleaseVersionRecordId, UserRoleId, VersionId } from '../../shared/types';
import {
  createReleaseBundle,
  createSemanticReleaseVersion,
  type CreateReleaseBundleInput,
  type ReleaseBundle,
  type SemanticReleaseVersion,
} from '../entities';
import {
  createReleaseVersion,
  markReleaseVersionSuperseded,
  ReleaseType,
  type ContentPackageVersion,
  type ReleaseVersion,
} from '../../versioning/entities';

export type VersionIncrementKind = 'major' | 'minor' | 'patch';

export interface ReleaseCompositionApprovalEntry {
  readonly entityId: string;
  readonly organizationId: string;
  readonly approvalStatus: ApprovalStatus;
  readonly versionId: VersionId;
  readonly currentVersionId: VersionId;
}

export interface ValidateApprovedInput {
  readonly contentPackage: Pick<
    CanonicalContentPackage,
    'id' | 'organizationId' | 'approvalStatus' | 'currentVersionId'
  >;
  readonly packageVersion: Pick<
    ContentPackageVersion,
    'id' | 'organizationId' | 'packageId'
  >;
  // Caller must provide real composition approval/current-version state.
  readonly compositionEntries: ReadonlyArray<ReleaseCompositionApprovalEntry>;
}

export interface CreateReleaseInput {
  readonly id: ReleaseVersionRecordId;
  readonly contentPackage: Pick<
    CanonicalContentPackage,
    'id' | 'organizationId' | 'regionId' | 'approvalStatus' | 'currentVersionId'
  >;
  readonly packageVersion: ContentPackageVersion;
  // Caller must provide real entry approval/current-version data for release validation.
  readonly compositionEntries: ReadonlyArray<ReleaseCompositionApprovalEntry>;
  readonly releasedAt: Date;
  readonly releasedBy: UserRoleId;
  readonly activeRelease?: ReleaseVersion | null;
  readonly rollbackSourceVersionId?: VersionId | null;
}

export interface ReleaseEngineOptions {
  readonly now?: () => Date;
}

export class ReleaseEngine {
  private readonly now: () => Date;

  public constructor(options: ReleaseEngineOptions = {}) {
    this.now = options.now ?? (() => new Date());
  }

  public createPackage(input: CreateReleaseBundleInput): ReleaseBundle {
    return freezeEntity(createReleaseBundle(input));
  }

  public createRelease(input: CreateReleaseInput): ReleaseVersion {
    this.assertTenantInvariant(input.contentPackage.organizationId, [
      input.packageVersion.organizationId,
      input.activeRelease?.organizationId ?? null,
    ]);

    this.validateApproved({
      contentPackage: input.contentPackage,
      packageVersion: input.packageVersion,
      compositionEntries: input.compositionEntries,
    });

    const releaseType = this.resolveReleaseType(
      input.contentPackage.currentVersionId,
      input.packageVersion.id,
      input.activeRelease ?? null,
      input.rollbackSourceVersionId ?? null,
    );

    const supersededRelease =
      input.activeRelease == null ? null : markReleaseVersionSuperseded(input.activeRelease);

    return freezeEntity(
      createReleaseVersion({
        id: input.id,
        organizationId: input.contentPackage.organizationId,
        regionId: input.contentPackage.regionId,
        packageVersionId: input.packageVersion.id,
        packageId: input.contentPackage.id,
        releasedAt: input.releasedAt,
        releasedBy: input.releasedBy,
        targetScope: input.packageVersion.targetScope,
        releaseType,
        supersededReleaseId: supersededRelease?.id ?? null,
        rollbackSourceVersionId:
          releaseType === ReleaseType.ROLLBACK
            ? input.rollbackSourceVersionId ?? input.packageVersion.id
            : null,
        compositionSnapshot: input.packageVersion.composition,
      }),
    );
  }

  public incrementVersion(
    previous: SemanticReleaseVersion | null | undefined,
    releasedBy: UserRoleId,
    kind: VersionIncrementKind = 'patch',
  ): SemanticReleaseVersion {
    const current =
      previous ??
      createSemanticReleaseVersion({
        version: '0.0.0' as VersionId,
        major: 0,
        minor: 0,
        patch: 0,
        createdAt: this.now(),
        releasedBy,
      });

    const next = this.getNextVersionSegments(current, kind);

    return freezeEntity(
      createSemanticReleaseVersion({
        version: `${next.major}.${next.minor}.${next.patch}` as VersionId,
        major: next.major,
        minor: next.minor,
        patch: next.patch,
        createdAt: this.now(),
        releasedBy,
      }),
    );
  }

  public validateApproved(input: ValidateApprovedInput): void {
    if (input.contentPackage.organizationId !== input.packageVersion.organizationId) {
      throw new DomainError(
        'CROSS_TENANT_ACCESS_DENIED',
        'ContentPackage and ContentPackageVersion must belong to the same organization.',
      );
    }

    if (input.contentPackage.id !== input.packageVersion.packageId) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'ContentPackageVersion.packageId must match ContentPackage.id.',
      );
    }

    if (input.contentPackage.currentVersionId !== input.packageVersion.id) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'ContentPackage.currentVersionId must match the released ContentPackageVersion.id.',
      );
    }

    if (input.contentPackage.approvalStatus !== ApprovalStatus.Approved) {
      throw new DomainError(
        'PACKAGE_NOT_APPROVED',
        'ContentPackage must be Approved before release.',
        { packageId: input.contentPackage.id },
      );
    }

    for (const entry of input.compositionEntries) {
      if (entry.organizationId !== input.contentPackage.organizationId) {
        throw new DomainError(
          'CROSS_TENANT_COMPOSITION_ENTRY',
          'All composition entries must belong to the same organization as the package.',
          { entityId: entry.entityId },
        );
      }

      if (entry.approvalStatus !== ApprovalStatus.Approved) {
        throw new DomainError(
          'COMPOSITION_ENTRY_NOT_APPROVED',
          'All composition entries must be Approved before release.',
          { entityId: entry.entityId, approvalStatus: entry.approvalStatus },
        );
      }

      if (entry.versionId !== entry.currentVersionId) {
        throw new DomainError(
          'COMPOSITION_VERSION_STALE',
          'All composition entries must reference the current approved version.',
          {
            entityId: entry.entityId,
            versionId: entry.versionId,
            currentVersionId: entry.currentVersionId,
          },
        );
      }
    }
  }

  public freeze<TValue>(value: TValue): Readonly<TValue> {
    return freezeEntity(value);
  }

  private resolveReleaseType(
    currentVersionId: VersionId,
    packageVersionId: VersionId,
    activeRelease: ReleaseVersion | null,
    rollbackSourceVersionId: VersionId | null,
  ): ReleaseType {
    if (rollbackSourceVersionId != null) {
      if (activeRelease == null) {
        throw new DomainError(
          'ROLLBACK_SOURCE_NOT_FOUND',
          'Rollback requires an active release to supersede.',
        );
      }

      return ReleaseType.ROLLBACK;
    }

    if (currentVersionId !== packageVersionId) {
      throw new DomainError(
        'COMPOSITION_VERSION_STALE',
        'Only the current package version can be released as Initial or Update.',
        { currentVersionId, packageVersionId },
      );
    }

    return activeRelease == null ? ReleaseType.INITIAL : ReleaseType.UPDATE;
  }

  private assertTenantInvariant(
    organizationId: string,
    relatedOrganizationIds: ReadonlyArray<string | null | undefined>,
  ): void {
    for (const relatedOrganizationId of relatedOrganizationIds) {
      if (
        relatedOrganizationId != null &&
        relatedOrganizationId !== organizationId
      ) {
        throw new DomainError(
          'CROSS_TENANT_ACCESS_DENIED',
          'ReleaseEngine tenant invariant violated.',
          { organizationId, relatedOrganizationId },
        );
      }
    }
  }

  private getNextVersionSegments(
    previous: SemanticReleaseVersion,
    kind: VersionIncrementKind,
  ): Pick<SemanticReleaseVersion, 'major' | 'minor' | 'patch'> {
    switch (kind) {
      case 'major':
        return {
          major: previous.major + 1,
          minor: 0,
          patch: 0,
        };
      case 'minor':
        return {
          major: previous.major,
          minor: previous.minor + 1,
          patch: 0,
        };
      case 'patch':
        return {
          major: previous.major,
          minor: previous.minor,
          patch: previous.patch + 1,
        };
    }
  }
}

function freezeEntity<TValue>(value: TValue): Readonly<TValue> {
  if (value == null || typeof value !== 'object') {
    return value as Readonly<TValue>;
  }

  if (Object.isFrozen(value)) {
    return value as Readonly<TValue>;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      freezeEntity(entry);
    }

    return Object.freeze(value) as Readonly<TValue>;
  }

  const record = value as Record<string, unknown>;
  for (const nested of Object.values(record)) {
    freezeEntity(nested);
  }

  return Object.freeze(value) as Readonly<TValue>;
}
