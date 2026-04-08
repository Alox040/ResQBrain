import type { AuditStamp } from '../../common/audit';
import type { OrgId as OrganizationId, VersionId } from '../../shared/types';

export interface Version {
  readonly id: VersionId;
  readonly organizationId: OrganizationId;
  readonly label: string;
  readonly previousVersionId?: VersionId | null;
  readonly created: AuditStamp;
  readonly changeSummary: string;
  readonly appendOnly: true;
}
