import type { GovernanceAuditTrail, VersionLineage } from '../common/audit';
import type { ApprovalStatus } from '../common/ApprovalStatus';
import type { ContentPackageItem } from '../common/contentPackageItem';
import type { ContentPackageId } from '../common/ids';
import type { OrganizationScoped, ScopedApplicability } from '../common/scope';

export interface ContentPackage
  extends OrganizationScoped,
    ScopedApplicability,
    VersionLineage {
  readonly id: ContentPackageId;
  readonly name: string;
  readonly description: string;
  readonly approvalStatus: ApprovalStatus;
  readonly targetAudiences: ReadonlyArray<string>;
  readonly algorithms: ReadonlyArray<ContentPackageItem>;
  readonly medications: ReadonlyArray<ContentPackageItem>;
  readonly protocols: ReadonlyArray<ContentPackageItem>;
  readonly guidelines: ReadonlyArray<ContentPackageItem>;
  readonly compatibilityNotes: ReadonlyArray<string>;
  readonly releaseNotes?: string;
  readonly governance: GovernanceAuditTrail;
  readonly appendOnlyHistory: true;
}
