export const AuditOperation = {
  Submit: 'submit',
  Approve: 'approve',
  Reject: 'reject',
  Release: 'release',
  Recall: 'recall',
  Deprecate: 'deprecate',
  Assign: 'assign',
  Revoke: 'revoke',
  CreateVersion: 'createVersion',
  Rollback: 'rollback',
} as const;

export type AuditOperation = (typeof AuditOperation)[keyof typeof AuditOperation];
