import type { AuditEvent } from './AuditEvent';

export interface ApprovalDecisionAuditEvent extends AuditEvent {
  readonly eventType: 'approval_decision';
  readonly targetEntityType:
    | 'Algorithm'
    | 'Medication'
    | 'Protocol'
    | 'Guideline'
    | 'ContentPackage';
  readonly approvalDecisionId: string;
  readonly versionId: string;
  readonly decision: 'approve' | 'reject' | 'request_changes' | 'abstain';
}
