import type { OrgId } from '../types/OrgId';
import type { UserId } from '../types/UserId';
import type { UserRoleId } from '../types/RoleId';
import type { AuditOperation } from './AuditOperation';

export const AuditEventType = {
  Lifecycle: 'lifecycle',
  PolicyDecision: 'policy_decision',
  VersionCreation: 'version_creation',
  Release: 'release',
  ContentDraftCreated: 'content_draft_created',
} as const;

export type AuditEventType = (typeof AuditEventType)[keyof typeof AuditEventType];

export const AuditTargetEntityType = {
  Algorithm: 'Algorithm',
  Medication: 'Medication',
  Protocol: 'Protocol',
  Guideline: 'Guideline',
  ContentPackage: 'ContentPackage',
  UserRole: 'UserRole',
  ApprovalDecision: 'ApprovalDecision',
  ReleaseRecord: 'ReleaseRecord',
} as const;

export type AuditTargetEntityType =
  (typeof AuditTargetEntityType)[keyof typeof AuditTargetEntityType];

export interface AuditEvent {
  readonly id: string;
  readonly eventType: AuditEventType;
  readonly organizationId: OrgId;
  readonly timestamp: string;
  readonly actorUserId: UserId;
  readonly actorRoleId: UserRoleId;
  readonly operation: AuditOperation;
  readonly targetEntityType: AuditTargetEntityType;
  readonly targetEntityId: string;
  readonly beforeState?: unknown | null;
  readonly afterState?: unknown | null;
  readonly rationale?: string | null;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
