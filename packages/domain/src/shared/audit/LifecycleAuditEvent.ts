import type { AuditEvent } from './AuditEvent';
import type { VersionId } from '../types/VersionId';

export interface LifecycleAuditEvent extends AuditEvent {
  readonly entityId: string;
  readonly entityType: string;
  readonly versionId: VersionId;
  readonly fromState: string;
  readonly toState: string;
  readonly capability: string;
  readonly rationale: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
