import type { OrgId } from '../../shared/types';

export function contentSharingPolicyExists(
  _sourceOrgId: OrgId,
  _targetOrgId: OrgId,
  _contentId: string,
): false {
  return false;
}
