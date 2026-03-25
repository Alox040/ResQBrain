import type { ContentEntityType } from '../common/enums';
import type {
  ContentEntityId,
  ContentPackageId,
  OrganizationId,
  VersionId,
} from '../common/ids';
import type { ApprovalStatus } from '../common/ApprovalStatus';
import { isImmutableApprovalStatus } from '../common/ApprovalStatus';
import { canTransitionApprovalStatus } from './ApprovalStatus';

export const LIFECYCLE_AGGREGATE_KINDS = [
  'ContentEntity',
  'ContentPackage',
] as const;

export type LifecycleAggregateKind =
  (typeof LIFECYCLE_AGGREGATE_KINDS)[number];

export interface VersionedLifecycleState {
  readonly aggregate: LifecycleAggregateKind;
  readonly organizationId: OrganizationId;
  readonly approvalStatus: ApprovalStatus;
  readonly currentVersionId: VersionId;
  readonly versionIds: ReadonlyArray<VersionId>;
}

export interface ContentEntityLifecycleState extends VersionedLifecycleState {
  readonly aggregate: 'ContentEntity';
  readonly entityType: ContentEntityType;
  readonly entityId: ContentEntityId;
}

export interface ContentPackageLifecycleState extends VersionedLifecycleState {
  readonly aggregate: 'ContentPackage';
  readonly contentPackageId: ContentPackageId;
  readonly memberApprovalStatuses: ReadonlyArray<ApprovalStatus>;
}

export type LifecycleState =
  | ContentEntityLifecycleState
  | ContentPackageLifecycleState;

export interface LifecycleContext {
  readonly organizationId: OrganizationId;
}

export function isLifecycleStateMutable(state: LifecycleState): boolean {
  return !isImmutableApprovalStatus(state.approvalStatus);
}

export function canTransitionLifecycleState(
  state: LifecycleState,
  nextStatus: ApprovalStatus,
): boolean {
  if (!canTransitionApprovalStatus(state.approvalStatus, nextStatus)) {
    return false;
  }

  if (state.aggregate === 'ContentPackage' && nextStatus === 'Released') {
    return state.memberApprovalStatuses.every(
      (status) => status === 'Approved' || status === 'Released',
    );
  }

  return true;
}
