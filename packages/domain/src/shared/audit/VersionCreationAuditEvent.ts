import type { AuditEvent } from './AuditEvent';
import type { VersionId } from '../types/VersionId';

export interface VersionCreationAuditEvent extends AuditEvent {
  readonly eventType: 'version_creation';
  readonly versionId: VersionId;
  readonly targetEntityId: string;
  readonly targetEntityType:
    | 'Algorithm'
    | 'Medication'
    | 'Protocol'
    | 'Guideline'
    | 'ContentPackage';
  readonly versionNumber: number;
  readonly predecessorVersionId?: VersionId | null;
  readonly changeReason?: string | null;
  readonly snapshot: Readonly<Record<string, unknown>>;
}
