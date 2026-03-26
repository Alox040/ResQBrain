export const Capability = {
  CONTENT_CREATE: 'content.create',
  CONTENT_EDIT: 'content.edit',
  CONTENT_SUBMIT: 'content.submit',
  CONTENT_REVIEW: 'content.review',
  CONTENT_APPROVE: 'content.approve',
  CONTENT_REJECT: 'content.reject',
  CONTENT_RECALL: 'content.recall',
  CONTENT_DEPRECATE: 'content.deprecate',
  PACKAGE_ASSEMBLE: 'package.assemble',
  PACKAGE_SUBMIT: 'package.submit',
  PACKAGE_APPROVE: 'package.approve',
  PACKAGE_REJECT: 'package.reject',
  PACKAGE_RECALL: 'package.recall',
  PACKAGE_RELEASE: 'package.release',
  PACKAGE_DEPRECATE: 'package.deprecate',
  ROLE_ASSIGN: 'role.assign',
  POLICY_MANAGE: 'policy.manage',
  SURVEYINSIGHT_SUBMIT: 'surveyinsight.submit',
  SURVEYINSIGHT_PRIORITIZE: 'surveyinsight.prioritize',
} as const;

export type Capability = (typeof Capability)[keyof typeof Capability];

export const ALL_CAPABILITIES = Object.freeze(
  Object.values(Capability),
) as readonly Capability[];
