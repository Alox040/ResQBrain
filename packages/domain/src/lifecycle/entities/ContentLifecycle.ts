import type {
  AlgorithmId,
  ContentPackageId,
  GuidelineId,
  MedicationId,
  OrgId,
  ProtocolId,
  VersionId,
} from '../../shared/types';

import {
  type ApprovalStatus,
  isEditableApprovalStatus,
  isImmutableApprovalStatus,
  isTerminalApprovalStatus,
} from './ApprovalStatus';

import type { ContentEntityType } from '../../versioning/entities/EntityType';

export const LIFECYCLE_AGGREGATE_KINDS = Object.freeze([
  'ContentEntity',
  'ContentPackage',
] as const);

export type LifecycleAggregateKind =
  (typeof LIFECYCLE_AGGREGATE_KINDS)[number];

export type ContentEntityId =
  | AlgorithmId
  | MedicationId
  | ProtocolId
  | GuidelineId;

export interface VersionedLifecycleState<
  TAggregate extends LifecycleAggregateKind = LifecycleAggregateKind,
  TStatus extends ApprovalStatus = ApprovalStatus,
> {
  readonly aggregate: TAggregate;
  readonly organizationId: OrgId;
  readonly approvalStatus: TStatus;
  readonly currentVersionId: VersionId;
}

export interface ContentEntityLifecycleState<
  TStatus extends ApprovalStatus = ApprovalStatus,
> extends VersionedLifecycleState<'ContentEntity', TStatus> {
  readonly entityType: ContentEntityType;
  readonly entityId: ContentEntityId;
}

export interface ContentPackageLifecycleState<
  TStatus extends ApprovalStatus = ApprovalStatus,
> extends VersionedLifecycleState<'ContentPackage', TStatus> {
  readonly contentPackageId: ContentPackageId;
  readonly releasedArtifactIds: readonly ContentEntityId[];
}

export type LifecycleState =
  | ContentEntityLifecycleState
  | ContentPackageLifecycleState;

export function isLifecycleStateEditable(state: LifecycleState): boolean {
  return isEditableApprovalStatus(state.approvalStatus);
}

export function isLifecycleStateImmutable(state: LifecycleState): boolean {
  return isImmutableApprovalStatus(state.approvalStatus);
}

export function isLifecycleStateTerminal(state: LifecycleState): boolean {
  return isTerminalApprovalStatus(state.approvalStatus);
}
