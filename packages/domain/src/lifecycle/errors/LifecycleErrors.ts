import type { ContentEntityId, OrganizationId } from '../../common/ids';
import type { ApprovalStatus } from '../entities/ApprovalStatus';
import { DomainError } from '../../shared/errors';

export class InvalidTransitionError extends DomainError {
  public constructor(from: ApprovalStatus, to: ApprovalStatus) {
    super(
      'INVALID_TRANSITION',
      `Lifecycle transition from "${from}" to "${to}" is not permitted.`,
      { from, to },
    );
  }
}

export class AlreadyReleasedError extends DomainError {
  public constructor(contentId: ContentEntityId) {
    super(
      'ALREADY_RELEASED',
      `Content "${contentId}" has already been released.`,
      { contentId },
    );
  }
}

export class TenantMismatchError extends DomainError {
  public constructor(
    expectedOrganizationId: OrganizationId,
    actualOrganizationId: OrganizationId,
  ) {
    super(
      'TENANT_MISMATCH',
      'Lifecycle operation violated tenant isolation.',
      {
        expectedOrganizationId,
        actualOrganizationId,
      },
    );
  }
}

export class NotApprovedError extends DomainError {
  public constructor(contentId: ContentEntityId, approvalStatus: ApprovalStatus) {
    super(
      'NOT_APPROVED',
      `Content "${contentId}" is not approved for this lifecycle operation.`,
      {
        contentId,
        approvalStatus,
      },
    );
  }
}

export class ImmutableContentError extends DomainError {
  public constructor(contentId: ContentEntityId, approvalStatus: ApprovalStatus) {
    super(
      'IMMUTABLE_CONTENT',
      `Content "${contentId}" is immutable in status "${approvalStatus}".`,
      {
        contentId,
        approvalStatus,
      },
    );
  }
}

export type LifecycleError =
  | InvalidTransitionError
  | AlreadyReleasedError
  | TenantMismatchError
  | NotApprovedError
  | ImmutableContentError;
