export const RoleType = {
  CONTENT_AUTHOR: 'ContentAuthor',
  REVIEWER: 'Reviewer',
  APPROVER: 'Approver',
  RELEASER: 'Releaser',
  ORG_ADMIN: 'OrgAdmin',
  READ_ONLY: 'ReadOnly',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];
