import type { ContentPackageId, OrganizationId, VersionId } from '../common/ids';
import type {
  ApprovalStatus,
  ContentPackageMemberRef,
} from '../lifecycle/ContentLifecycle';

export const RELEASE_BUNDLE_APPROVAL_STATUSES = ['Approved', 'Released'] as const;

export type ReleaseBundleApprovalStatus =
  (typeof RELEASE_BUNDLE_APPROVAL_STATUSES)[number];

export interface ReleaseBundle {
  readonly organizationId: OrganizationId;
  readonly contentPackageId: ContentPackageId;
  readonly packageVersionId: VersionId;
  readonly packageApprovalStatus: ReleaseBundleApprovalStatus;
  readonly members: ReadonlyArray<ContentPackageMemberRef>;
}

export interface ReleaseBundleCandidate {
  readonly organizationId: OrganizationId | null;
  readonly contentPackageId: ContentPackageId;
  readonly packageVersionId: VersionId;
  readonly packageApprovalStatus: ApprovalStatus;
  readonly members: ReadonlyArray<ContentPackageMemberRef>;
}

export const RELEASE_BUNDLE_GUARD_CODES = [
  'organization-scope-required',
  'package-must-be-releasable',
  'members-required',
  'members-must-match-organization',
  'members-must-reference-approved-versions',
  'released-bundle-immutable',
] as const;

export type ReleaseBundleGuardCode =
  (typeof RELEASE_BUNDLE_GUARD_CODES)[number];

export class ReleaseBundleGuardError extends Error {
  readonly code: ReleaseBundleGuardCode;

  constructor(code: ReleaseBundleGuardCode) {
    super(code);
    this.name = 'ReleaseBundleGuardError';
    this.code = code;
  }
}

export function isReleaseBundleApprovalStatus(
  status: ApprovalStatus,
): status is ReleaseBundleApprovalStatus {
  return RELEASE_BUNDLE_APPROVAL_STATUSES.includes(
    status as ReleaseBundleApprovalStatus,
  );
}

export function isReleasedBundle(bundle: ReleaseBundle): boolean {
  return bundle.packageApprovalStatus === 'Released';
}

export function isBundleWithinOrganizationScope(
  bundle: ReleaseBundleCandidate,
  organizationId: OrganizationId,
): bundle is ReleaseBundleCandidate & { readonly organizationId: OrganizationId } {
  return bundle.organizationId !== null && bundle.organizationId === organizationId;
}

export function hasApprovedBundleMembers(
  bundle: Pick<ReleaseBundleCandidate, 'members'>,
): boolean {
  return bundle.members.every((member) => member.versionStatus === 'approved');
}

export function hasBundleMembersWithinOrganizationScope(
  bundle: Pick<ReleaseBundleCandidate, 'organizationId' | 'members'>,
): boolean {
  return (
    bundle.organizationId !== null &&
    bundle.members.every((member) => member.organizationId === bundle.organizationId)
  );
}

export function canCreateReleaseBundle(
  bundle: ReleaseBundleCandidate,
  organizationId: OrganizationId,
): boolean {
  return (
    isBundleWithinOrganizationScope(bundle, organizationId) &&
    isReleaseBundleApprovalStatus(bundle.packageApprovalStatus) &&
    bundle.members.length > 0 &&
    hasApprovedBundleMembers(bundle) &&
    hasBundleMembersWithinOrganizationScope(bundle)
  );
}

export function assertReleaseBundleCandidate(
  bundle: ReleaseBundleCandidate,
  organizationId: OrganizationId,
): ReleaseBundleCandidate & { readonly organizationId: OrganizationId } {
  if (!isBundleWithinOrganizationScope(bundle, organizationId)) {
    throw new ReleaseBundleGuardError('organization-scope-required');
  }

  if (!isReleaseBundleApprovalStatus(bundle.packageApprovalStatus)) {
    throw new ReleaseBundleGuardError('package-must-be-releasable');
  }

  if (bundle.members.length === 0) {
    throw new ReleaseBundleGuardError('members-required');
  }

  if (!hasApprovedBundleMembers(bundle)) {
    throw new ReleaseBundleGuardError('members-must-reference-approved-versions');
  }

  if (!hasBundleMembersWithinOrganizationScope(bundle)) {
    throw new ReleaseBundleGuardError('members-must-match-organization');
  }

  return bundle;
}

export function assertBundleIsMutable(bundle: ReleaseBundle): ReleaseBundle {
  if (isReleasedBundle(bundle)) {
    throw new ReleaseBundleGuardError('released-bundle-immutable');
  }

  return bundle;
}
