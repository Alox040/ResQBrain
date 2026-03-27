import type { VersionId } from '../types/VersionId';
import type { AuditEvent } from './AuditEvent';

export interface ContentDraftCreatedAuditEvent extends AuditEvent {
  readonly eventType: 'content_draft_created';
  readonly targetEntityType: 'Algorithm' | 'Medication' | 'Protocol' | 'Guideline';
  readonly targetEntityId: string;
  readonly versionId: VersionId;
  readonly initialSnapshot: Readonly<Record<string, unknown>>;
  readonly rationale?: string | null;
}
