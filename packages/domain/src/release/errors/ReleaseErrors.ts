import type { ContentPackageId, OrgId, VersionId } from '../../shared/types';

import { DomainError } from '../../shared/errors';

export class UnapprovedContentError extends DomainError {
  public constructor(
    contentPackageId: ContentPackageId,
    approvalStatus: string,
  ) {
    super(
      'UNAPPROVED_CONTENT',
      `Content package "${contentPackageId}" is not approved for release.`,
      {
        contentPackageId,
        approvalStatus,
      },
    );
  }
}

export class VersionConflictError extends DomainError {
  public constructor(
    expectedVersion: VersionId,
    actualVersion: VersionId,
  ) {
    super(
      'VERSION_CONFLICT',
      'Release operation encountered a version conflict.',
      {
        expectedVersion,
        actualVersion,
      },
    );
  }
}

export class ReleaseTenantMismatchError extends DomainError {
  public constructor(
    expectedOrganizationId: OrgId,
    actualOrganizationId: OrgId,
  ) {
    super(
      'TENANT_MISMATCH',
      'Release operation violated tenant isolation.',
      {
        expectedOrganizationId,
        actualOrganizationId,
      },
    );
  }
}

export class ImmutableReleaseError extends DomainError {
  public constructor(version: VersionId) {
    super(
      'IMMUTABLE_RELEASE',
      `Release "${version}" is immutable and cannot be changed.`,
      {
        version,
      },
    );
  }
}

export class EmptyPackageError extends DomainError {
  public constructor(contentPackageId: ContentPackageId) {
    super(
      'EMPTY_PACKAGE',
      `Content package "${contentPackageId}" must contain at least one content item.`,
      {
        contentPackageId,
      },
    );
  }
}

export type ReleaseError =
  | UnapprovedContentError
  | VersionConflictError
  | ReleaseTenantMismatchError
  | ImmutableReleaseError
  | EmptyPackageError;
