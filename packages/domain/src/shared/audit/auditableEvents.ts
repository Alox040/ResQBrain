import type { ApprovalDecisionAuditEvent } from './ApprovalDecisionAuditEvent';
import type { ContentDraftCreatedAuditEvent } from './ContentDraftCreatedAuditEvent';
import type { LifecycleAuditEvent } from './LifecycleAuditEvent';
import type { PolicyDecisionAuditEvent } from './PolicyDecisionAuditEvent';
import type { ReleaseAuditEvent } from './ReleaseAuditEvent';
import type { VersionCreationAuditEvent } from './VersionCreationAuditEvent';

/**
 * Persisted audit payload: every subtype includes {@link import('./AuditEvent').AuditEvent.timestamp}.
 */
export type AuditableEvent =
  | ApprovalDecisionAuditEvent
  | ContentDraftCreatedAuditEvent
  | LifecycleAuditEvent
  | PolicyDecisionAuditEvent
  | VersionCreationAuditEvent
  | ReleaseAuditEvent;

/**
 * Write payload: omit `timestamp` per subtype so fields are not collapsed to the union intersection.
 * (`Omit<Union, 'timestamp'>` alone would only keep keys shared by every subtype.)
 */
export type AuditRecordEvent =
  | Omit<ApprovalDecisionAuditEvent, 'timestamp'>
  | Omit<ContentDraftCreatedAuditEvent, 'timestamp'>
  | Omit<LifecycleAuditEvent, 'timestamp'>
  | Omit<PolicyDecisionAuditEvent, 'timestamp'>
  | Omit<VersionCreationAuditEvent, 'timestamp'>
  | Omit<ReleaseAuditEvent, 'timestamp'>;
