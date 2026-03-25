import type { UserId, VersionId } from './ids';

export type AuditTimestamp = string;

export interface AuditStamp {
  readonly at: AuditTimestamp;
  readonly byUserId: UserId;
  readonly rationale?: string;
}

export interface GovernanceAuditTrail {
  readonly created: AuditStamp;
  readonly updated?: AuditStamp;
  readonly submittedForReview?: AuditStamp;
  readonly approved?: AuditStamp;
  readonly rejected?: AuditStamp;
  readonly released?: AuditStamp;
  readonly deprecated?: AuditStamp;
}

export interface VersionLineage {
  readonly currentVersionId: VersionId;
  readonly versionIds: ReadonlyArray<VersionId>;
}

export type AppendOnlyHistory<TEntry> = ReadonlyArray<Readonly<TEntry>>;
