export const ReleaseType = {
  INITIAL: 'Initial',
  UPDATE: 'Update',
  ROLLBACK: 'Rollback',
} as const;

export type ReleaseType = (typeof ReleaseType)[keyof typeof ReleaseType];
