import type {
  AlgorithmId,
  OrgId,
  UserRoleId,
  VersionId,
} from '../../shared/types';

import type { ApprovalStatus } from './ApprovalStatus';
import type { ScopeTarget } from './ScopeTarget';

export interface ContentAuditTrailEntry {
  readonly recordedAt: Date;
  readonly actorRoleId: UserRoleId;
  readonly operation: string;
  readonly rationale: string;
}

export interface Algorithm {
  readonly id: AlgorithmId;
  readonly organizationId: OrgId;
  readonly entityType: 'Algorithm';
  readonly title: string;
  readonly steps: string;
  readonly applicabilityScope: ScopeTarget;
  readonly currentVersionId: VersionId;
  readonly approvalStatus: ApprovalStatus;
  readonly effectiveDate: Date | null;
  readonly deprecationDate: Date | null;
  readonly deprecationReason: string | null;
  readonly auditTrail: ReadonlyArray<ContentAuditTrailEntry>;
}
