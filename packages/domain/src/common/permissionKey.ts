export const PERMISSION_KEYS = [
  'content.submit',
  'content.approve',
  'content.reject',
  'content.revise',
  'content.deprecate',
  'package.submit',
  'package.approve',
  'package.reject',
  'package.release',
  'package.deprecate',
  'survey.read',
  'survey.prioritize',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];
