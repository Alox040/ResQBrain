import type {
  ContentPackageId,
  OrganizationId,
  ReleaseId,
  UserId,
  VersionId,
} from '../common/ids';
import type { ApprovalStatus } from '../common/ApprovalStatus';
import { isReleaseSourceApprovalStatus } from '../common/ApprovalStatus';

export type ReleaseTimestamp = string;

export interface ReleasePackageReference {
  readonly contentPackageId: ContentPackageId;
  readonly packageVersionId: VersionId;
}

export interface Release {
  readonly id: ReleaseId;
  readonly organizationId: OrganizationId;
  readonly contentPackageId: ContentPackageId;
  readonly packageVersionId: VersionId;
  readonly releasedAt: ReleaseTimestamp;
  readonly releasedByUserId: UserId;
  readonly previousReleaseId: ReleaseId | null;
  readonly appendOnly: true;
}

export interface ReleaseContext {
  readonly organizationId: OrganizationId;
}

export interface ReleaseCandidate extends ReleasePackageReference {
  readonly organizationId: OrganizationId;
  readonly packageApprovalStatus: ApprovalStatus;
  readonly previousReleaseId: ReleaseId | null;
}

export const RELEASE_INVARIANT_CODES = [
  'tenant-boundary-required',
  'source-package-must-be-approved',
  'release-history-is-append-only',
  'released-artifacts-are-immutable',
] as const;

export type ReleaseInvariantCode = (typeof RELEASE_INVARIANT_CODES)[number];

export class ReleaseGuardError extends Error {
  readonly code: ReleaseInvariantCode;

  constructor(code: ReleaseInvariantCode) {
    super(code);
    this.name = 'ReleaseGuardError';
    this.code = code;
  }
}

export function isRollbackRelease(release: Release): boolean {
  return release.previousReleaseId !== null;
}

export function belongsToOrganization(
  release: Release,
  organizationId: OrganizationId,
): boolean {
  return release.organizationId === organizationId;
}

export function isReleaseCandidateWithinOrganization(
  candidate: ReleaseCandidate,
  context: ReleaseContext,
): candidate is ReleaseCandidate & { readonly organizationId: OrganizationId } {
  return candidate.organizationId === context.organizationId;
}

export function canCreateReleaseFromCandidate(
  candidate: ReleaseCandidate,
  context: ReleaseContext,
): boolean {
  return (
    isReleaseCandidateWithinOrganization(candidate, context) &&
    isReleaseSourceApprovalStatus(candidate.packageApprovalStatus)
  );
}

export function assertReleaseBelongsToOrganization(
  release: Release,
  organizationId: OrganizationId,
): Release {
  if (!belongsToOrganization(release, organizationId)) {
    throw new ReleaseGuardError('tenant-boundary-required');
  }

  return release;
}

export function assertReleasableCandidate(
  candidate: ReleaseCandidate,
  context: ReleaseContext,
): ReleaseCandidate & { readonly organizationId: OrganizationId } {
  if (!isReleaseCandidateWithinOrganization(candidate, context)) {
    throw new ReleaseGuardError('tenant-boundary-required');
  }

  if (!isReleaseSourceApprovalStatus(candidate.packageApprovalStatus)) {
    throw new ReleaseGuardError('source-package-must-be-approved');
  }

  return candidate;
}
