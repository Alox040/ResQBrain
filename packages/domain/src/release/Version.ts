import type { AuditStamp } from '../common/audit';
import type { OrganizationId, VersionId } from '../common/ids';

export interface Version {
  readonly id: VersionId;
  readonly organizationId: OrganizationId;
  readonly label: string;
  readonly previousVersionId?: VersionId | null;
  readonly created: AuditStamp;
  readonly changeSummary: string;
  readonly appendOnly: true;
}
