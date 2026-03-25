export const ReleaseStatus = {
  ACTIVE: 'Active',
  SUPERSEDED: 'Superseded',
} as const;

export type ReleaseStatus = (typeof ReleaseStatus)[keyof typeof ReleaseStatus];
