export const USER_ROLE_NAMES = [
  'Author',
  'Reviewer',
  'Approver',
  'Releaser',
  'OrganizationAdmin',
] as const;

export type UserRoleName = (typeof USER_ROLE_NAMES)[number];
