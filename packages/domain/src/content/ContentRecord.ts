import type { GovernanceAuditTrail, VersionLineage } from '../common/audit';
import type { ContentEntityType } from '../common/enums';
import type { OrganizationScoped, ScopedApplicability } from '../common/scope';
import type { ApprovalStatus } from '../common/ApprovalStatus';

export interface ContentRecord<
  TId extends string,
  TType extends ContentEntityType,
> extends OrganizationScoped,
    ScopedApplicability,
    VersionLineage {
  readonly id: TId;
  readonly entityType: TType;
  readonly title: string;
  readonly summary: string;
  readonly approvalStatus: ApprovalStatus;
  readonly governance: GovernanceAuditTrail;
  readonly appendOnlyHistory: true;
}
