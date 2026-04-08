import type { ContentEntityId } from '../../common/ids';
import type { UserRoleName } from '../../common/userRoleName';
import type { OrgId, VersionId } from '../../shared/types';

export interface ContentLifecycleCommandBase {
  readonly contentId: ContentEntityId;
  readonly organizationId: OrgId;
  readonly versionId: VersionId;
  readonly userRole: UserRoleName;
  readonly timestamp: Date;
}

export interface SubmitForReviewCommand
  extends ContentLifecycleCommandBase {
  readonly kind: 'SubmitForReview';
}

export interface ApproveContentCommand
  extends ContentLifecycleCommandBase {
  readonly kind: 'ApproveContent';
}

export interface ReleaseContentCommand
  extends ContentLifecycleCommandBase {
  readonly kind: 'ReleaseContent';
}

export interface DeprecateContentCommand
  extends ContentLifecycleCommandBase {
  readonly kind: 'DeprecateContent';
}
