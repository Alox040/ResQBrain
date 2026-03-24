import type {
  AlgorithmId,
  ContentPackageId,
  GuidelineId,
  MedicationId,
  OrganizationId,
  ProtocolId,
  VersionId,
} from '../common/ids';

export const APPROVAL_STATUSES = [
  'Draft',
  'InReview',
  'Approved',
  'Rejected',
  'Released',
  'Deprecated',
] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const CONTENT_ENTITY_VERSION_STATUSES = [
  'draft',
  'approved',
  'archived',
] as const;

export type ContentEntityVersionStatus =
  (typeof CONTENT_ENTITY_VERSION_STATUSES)[number];

export const CONTENT_KINDS = [
  'Algorithm',
  'Medication',
  'Protocol',
  'Guideline',
] as const;

export type ContentKind = (typeof CONTENT_KINDS)[number];

export const LIFECYCLE_AGGREGATE_KINDS = [
  'ContentEntity',
  'ContentPackage',
] as const;

export type LifecycleAggregateKind =
  (typeof LIFECYCLE_AGGREGATE_KINDS)[number];

export const LIFECYCLE_TRANSITION_NAMES = [
  'SubmitForReview',
  'Approve',
  'Reject',
  'Revise',
  'Release',
  'Deprecate',
] as const;

export type LifecycleTransitionName =
  (typeof LIFECYCLE_TRANSITION_NAMES)[number];

export const CONTENT_ENTITY_TRANSITION_CODES = [
  'CE-1',
  'CE-2',
  'CE-3',
  'CE-4',
  'CE-5',
  'CE-6',
] as const;

export type ContentEntityTransitionCode =
  (typeof CONTENT_ENTITY_TRANSITION_CODES)[number];

export const CONTENT_PACKAGE_TRANSITION_CODES = [
  'CP-1',
  'CP-2',
  'CP-3',
  'CP-4',
  'CP-5',
  'CP-6',
] as const;

export type ContentPackageTransitionCode =
  (typeof CONTENT_PACKAGE_TRANSITION_CODES)[number];

export type LifecycleTransitionCode =
  | ContentEntityTransitionCode
  | ContentPackageTransitionCode;

export type ContentEntityLineId =
  | AlgorithmId
  | MedicationId
  | ProtocolId
  | GuidelineId;

export interface ContentVersionReference {
  readonly organizationId: OrganizationId | null;
  readonly contentId: ContentEntityLineId;
  readonly versionId: VersionId;
  readonly kind: ContentKind;
  readonly versionStatus: ContentEntityVersionStatus;
}

export interface ContentPackageMemberRef extends ContentVersionReference {}

export interface LifecycleState {
  readonly organizationId: OrganizationId | null;
  readonly approvalStatus: ApprovalStatus;
}

export interface ContentEntityLifecycleState extends LifecycleState {
  readonly aggregate: 'ContentEntity';
  readonly kind: ContentKind;
  readonly contentId: ContentEntityLineId;
  readonly currentVersionId: VersionId;
  readonly currentVersionStatus: ContentEntityVersionStatus;
}

export interface ContentPackageLifecycleState extends LifecycleState {
  readonly aggregate: 'ContentPackage';
  readonly packageId: ContentPackageId;
  readonly packageVersionId: VersionId;
  readonly packageVersionApprovalStatus: ApprovalStatus;
  readonly members: ReadonlyArray<ContentPackageMemberRef>;
}

export type VersionedContentLifecycleState =
  | ContentEntityLifecycleState
  | ContentPackageLifecycleState;

export interface LifecycleContext {
  readonly organizationId: OrganizationId;
  readonly sourceOrganizationId: OrganizationId | null;
  readonly targetOrganizationId: OrganizationId | null;
}

export interface LifecycleTransition<
  TAggregate extends LifecycleAggregateKind = LifecycleAggregateKind,
> {
  readonly code: TAggregate extends 'ContentEntity'
    ? ContentEntityTransitionCode
    : ContentPackageTransitionCode;
  readonly aggregate: TAggregate;
  readonly name: LifecycleTransitionName;
  readonly from: ApprovalStatus;
  readonly to: ApprovalStatus;
  readonly direct: boolean;
  readonly immutableAfterTransition: boolean;
  readonly requiresOrganizationScope: boolean;
  readonly requiresApprovedContentMembers: boolean;
}

export interface LifecycleInvariant {
  readonly code:
    | 'INV-01'
    | 'INV-02'
    | 'INV-03'
    | 'INV-04'
    | 'INV-05'
    | 'INV-06'
    | 'INV-07'
    | 'INV-08'
    | 'INV-09'
    | 'INV-10'
    | 'INV-11';
  readonly description: string;
}

export const CONTENT_ENTITY_LIFECYCLE_TRANSITIONS: ReadonlyArray<
  LifecycleTransition<'ContentEntity'>
> = [
  {
    code: 'CE-1',
    aggregate: 'ContentEntity',
    name: 'SubmitForReview',
    from: 'Draft',
    to: 'InReview',
    direct: true,
    immutableAfterTransition: false,
    requiresOrganizationScope: true,
    requiresApprovedContentMembers: false,
  },
  {
    code: 'CE-2',
    aggregate: 'ContentEntity',
    name: 'Approve',
    from: 'InReview',
    to: 'Approved',
    direct: true,
    immutableAfterTransition: false,
    requiresOrganizationScope: false,
    requiresApprovedContentMembers: false,
  },
  {
    code: 'CE-3',
    aggregate: 'ContentEntity',
    name: 'Reject',
    from: 'InReview',
    to: 'Rejected',
    direct: true,
    immutableAfterTransition: false,
    requiresOrganizationScope: false,
    requiresApprovedContentMembers: false,
  },
  {
    code: 'CE-4',
    aggregate: 'ContentEntity',
    name: 'Revise',
    from: 'Rejected',
    to: 'Draft',
    direct: true,
    immutableAfterTransition: false,
    requiresOrganizationScope: false,
    requiresApprovedContentMembers: false,
  },
  {
    code: 'CE-5',
    aggregate: 'ContentEntity',
    name: 'Release',
    from: 'Approved',
    to: 'Released',
    direct: false,
    immutableAfterTransition: true,
    requiresOrganizationScope: false,
    requiresApprovedContentMembers: false,
  },
  {
    code: 'CE-6',
    aggregate: 'ContentEntity',
    name: 'Deprecate',
    from: 'Released',
    to: 'Deprecated',
    direct: true,
    immutableAfterTransition: true,
    requiresOrganizationScope: false,
    requiresApprovedContentMembers: false,
  },
] as const;

export const CONTENT_PACKAGE_LIFECYCLE_TRANSITIONS: ReadonlyArray<
  LifecycleTransition<'ContentPackage'>
> = [
  {
    code: 'CP-1',
    aggregate: 'ContentPackage',
    name: 'SubmitForReview',
    from: 'Draft',
    to: 'InReview',
    direct: true,
    immutableAfterTransition: false,
    requiresOrganizationScope: true,
    requiresApprovedContentMembers: true,
  },
  {
    code: 'CP-2',
    aggregate: 'ContentPackage',
    name: 'Approve',
    from: 'InReview',
    to: 'Approved',
    direct: true,
    immutableAfterTransition: false,
    requiresOrganizationScope: false,
    requiresApprovedContentMembers: false,
  },
  {
    code: 'CP-3',
    aggregate: 'ContentPackage',
    name: 'Reject',
    from: 'InReview',
    to: 'Rejected',
    direct: true,
    immutableAfterTransition: false,
    requiresOrganizationScope: false,
    requiresApprovedContentMembers: false,
  },
  {
    code: 'CP-4',
    aggregate: 'ContentPackage',
    name: 'Revise',
    from: 'Rejected',
    to: 'Draft',
    direct: true,
    immutableAfterTransition: false,
    requiresOrganizationScope: false,
    requiresApprovedContentMembers: false,
  },
  {
    code: 'CP-5',
    aggregate: 'ContentPackage',
    name: 'Release',
    from: 'Approved',
    to: 'Released',
    direct: true,
    immutableAfterTransition: true,
    requiresOrganizationScope: true,
    requiresApprovedContentMembers: true,
  },
  {
    code: 'CP-6',
    aggregate: 'ContentPackage',
    name: 'Deprecate',
    from: 'Released',
    to: 'Deprecated',
    direct: true,
    immutableAfterTransition: true,
    requiresOrganizationScope: false,
    requiresApprovedContentMembers: false,
  },
] as const;

export const CONTENT_LIFECYCLE_INVARIANTS: ReadonlyArray<LifecycleInvariant> = [
  {
    code: 'INV-01',
    description:
      "Released is immutable; only the transition to Deprecated remains valid.",
  },
  {
    code: 'INV-02',
    description:
      "A ContentPackage may only enter InReview or Released when every referenced ContentEntityVersion is approved.",
  },
  {
    code: 'INV-03',
    description:
      "ContentPackage release cascades atomically to all referenced ContentEntity lines from Approved to Released.",
  },
  {
    code: 'INV-04',
    description:
      "Organization is a hard boundary; lifecycle operations require organization identity equality across context, lines, versions, packages, and release scope.",
  },
  {
    code: 'INV-05',
    description:
      "Version history is append-only; no version is deleted and archival is the only allowed terminal mutation on a version.",
  },
  {
    code: 'INV-06',
    description: 'Deprecated is a terminal lifecycle state.',
  },
  {
    code: 'INV-07',
    description:
      "CE-5 is not a direct entry point; ContentEntity release is only a postcondition of ContentPackage release.",
  },
  {
    code: 'INV-08',
    description:
      'A released package version is unique in release history and cannot be published twice as the same release target.',
  },
  {
    code: 'INV-09',
    description:
      'Global templates with organizationId = null are not directly releasable.',
  },
  {
    code: 'INV-10',
    description:
      'ContentPackage composition is frozen once the package has entered InReview.',
  },
  {
    code: 'INV-11',
    description:
      'Rollback creates a new release record that points to an earlier approved package version without mutating the replaced release.',
  },
] as const;

export const IMMUTABLE_APPROVAL_STATUSES: ReadonlyArray<ApprovalStatus> = [
  'Released',
  'Deprecated',
] as const;

export const TERMINAL_APPROVAL_STATUSES: ReadonlyArray<ApprovalStatus> = [
  'Deprecated',
] as const;
