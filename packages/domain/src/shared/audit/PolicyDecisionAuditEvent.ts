import type { AuditEvent } from './AuditEvent';
import type { DenyReason } from '../types/DenyReason';
import type { PolicyDecision, PolicyWarning } from '../types/PolicyDecision';

export interface PolicyDecisionAuditEvent extends AuditEvent {
  readonly policyType: string;
  readonly targetEntityId: string;
  readonly targetEntityType: string;
  readonly capability: string;
  readonly decision: PolicyDecision['allowed'];
  readonly denyReason?: DenyReason;
  readonly warnings: readonly PolicyWarning[];
  readonly evaluationInputs: Readonly<Record<string, unknown>>;
}
