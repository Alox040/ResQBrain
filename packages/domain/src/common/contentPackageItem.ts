import type { PackageMemberType } from './enums';
import type {
  AlgorithmId,
  GuidelineId,
  MedicationId,
  ProtocolId,
  VersionId,
} from './ids';
import type { ApprovalStatus } from './ApprovalStatus';

export type ContentPackageMemberId =
  | AlgorithmId
  | MedicationId
  | ProtocolId
  | GuidelineId;

export interface ContentPackageItem {
  readonly entityType: PackageMemberType;
  readonly entityId: ContentPackageMemberId;
  readonly versionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
}
