import type {
  ApprovalStatus,
  ReleaseSourceApprovalStatus,
} from '../common/ApprovalStatus';
import { isReleaseSourceApprovalStatus } from '../common/ApprovalStatus';
import type { ContentPackageItem } from '../common/contentPackageItem';
import type {
  ContentPackageId,
  OrganizationId,
  VersionId,
} from '../common/ids';

export type ReleaseBundleApprovalStatus = ReleaseSourceApprovalStatus;

export interface ReleaseBundle {
  readonly organizationId: OrganizationId;
  readonly contentPackageId: ContentPackageId;
  readonly packageVersionId: VersionId;
  readonly packageApprovalStatus: ReleaseBundleApprovalStatus;
  readonly members: ReadonlyArray<ContentPackageItem>;
}

export interface ReleaseBundleCandidate {
  readonly organizationId: OrganizationId;
  readonly contentPackageId: ContentPackageId;
  readonly packageVersionId: VersionId;
  readonly packageApprovalStatus: ApprovalStatus;
  readonly members: ReadonlyArray<ContentPackageItem>;
}

export const RELEASE_BUNDLE_GUARD_CODES = [
  'organization-scope-required',
  'package-must-be-releasable',
  'members-required',
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
  return isReleaseSourceApprovalStatus(status);
}

export function isReleasedBundle(bundle: ReleaseBundle): boolean {
  return bundle.packageApprovalStatus === 'Released';
}

export function isBundleWithinOrganizationScope(
  bundle: ReleaseBundleCandidate,
  organizationId: OrganizationId,
): bundle is ReleaseBundleCandidate & { readonly organizationId: OrganizationId } {
  return bundle.organizationId === organizationId;
}

export function hasApprovedBundleMembers(
  bundle: Pick<ReleaseBundleCandidate, 'members'>,
): boolean {
  return bundle.members.every(
    (member) => member.approvalStatus === 'Approved' || member.approvalStatus === 'Released',
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
    hasApprovedBundleMembers(bundle)
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

  return bundle;
}

export function assertBundleIsMutable(bundle: ReleaseBundle): ReleaseBundle {
  if (isReleasedBundle(bundle)) {
    throw new ReleaseBundleGuardError('released-bundle-immutable');
  }

  return bundle;
}
