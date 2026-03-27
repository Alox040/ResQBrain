import type { AuditEvent } from './AuditEvent';
import type { VersionId } from '../types/VersionId';

export interface LifecycleAuditEvent extends AuditEvent {
  readonly eventType: 'lifecycle';
  readonly targetEntityType:
    | 'Algorithm'
    | 'Medication'
    | 'Protocol'
    | 'Guideline'
    | 'ContentPackage'
    | 'UserRole';
  readonly targetEntityId: string;
  readonly versionId?: VersionId;
  readonly fromState: string;
  readonly toState: string;
  readonly capability: string;
  readonly rationale: string;
  readonly beforeState?: string;
  readonly afterState?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
