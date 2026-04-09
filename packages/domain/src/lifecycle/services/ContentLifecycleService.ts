import { ApprovalStatus, type ApprovalStatus as ApprovalStatusValue } from '../entities/ApprovalStatus';
import type { OrgId, UserId, VersionId } from '../../shared/types';
import type { ContentEntityId } from '../../common/ids';

export type ContentId = ContentEntityId;
export type OrganizationId = OrgId;
export type VersionIdentifier = VersionId;
export type LifecyclePermissionKey = string;

export interface ResultOk<TValue> {
  readonly ok: true;
  readonly value: TValue;
  readonly error?: undefined;
}

export interface ResultErr<TError> {
  readonly ok: false;
  readonly value?: undefined;
  readonly error: TError;
}

export type Result<TValue, TError> = ResultOk<TValue> | ResultErr<TError>;

export interface LifecycleCommandBase {
  readonly contentId: ContentId;
  readonly organizationId: OrganizationId;
  readonly actorId: UserId;
  readonly rationale?: string;
  readonly occurredAt?: Date;
}

export interface SubmitForReviewCommand extends LifecycleCommandBase {
  readonly kind: 'SubmitForReview';
}

export interface ApproveContentCommand extends LifecycleCommandBase {
  readonly kind: 'ApproveContent';
}

export interface RejectContentCommand extends LifecycleCommandBase {
  readonly kind: 'RejectContent';
}

export interface ReleaseContentCommand extends LifecycleCommandBase {
  readonly kind: 'ReleaseContent';
  readonly fixedVersion: VersionIdentifier;
}

export interface DeprecateContentCommand extends LifecycleCommandBase {
  readonly kind: 'DeprecateContent';
  readonly deprecationReason: string;
}

export type ContentLifecycleError =
  | {
      readonly kind: 'InvalidTransition';
      readonly from: ApprovalStatusValue;
      readonly to: ApprovalStatusValue;
    }
  | {
      readonly kind: 'OrganizationMismatch';
      readonly contentOrgId: OrganizationId;
      readonly commandOrgId: OrganizationId;
    }
  | {
      readonly kind: 'ContentIsImmutable';
      readonly contentId: ContentId;
      readonly status: 'Released';
    }
  | {
      readonly kind: 'ContentIsNotEditable';
      readonly contentId: ContentId;
      readonly status: 'Deprecated';
    }
  | {
      readonly kind: 'VersionNotFixed';
      readonly contentId: ContentId;
    }
  | {
      readonly kind: 'MissingDeprecationReason';
      readonly contentId: ContentId;
    }
  | {
      readonly kind: 'ContentNotFound';
      readonly contentId: ContentId;
    }
  | {
      readonly kind: 'InsufficientPermission';
      readonly actorId: UserId;
      readonly required: LifecyclePermissionKey;
    };

export type GuardResult =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly reason: ContentLifecycleError };

export interface LifecycleAuditRecord {
  readonly contentId: ContentId;
  readonly organizationId: OrganizationId;
  readonly actorId: UserId;
  readonly timestamp: Date;
  readonly from: ApprovalStatusValue;
  readonly to: ApprovalStatusValue;
  readonly priorState: ApprovalStatusValue;
  readonly rationale: string | null;
  readonly fixedVersion: VersionIdentifier | null;
  readonly deprecationReason: string | null;
}

export interface ContentLifecycleTransitionResult<
  TContent extends LifecycleManagedContent = LifecycleManagedContent,
> {
  readonly content: TContent;
  readonly audit: LifecycleAuditRecord;
}

export interface LifecycleManagedContent {
  readonly id: ContentId;
  readonly organizationId: OrganizationId;
  readonly approvalStatus: ApprovalStatusValue;
  readonly currentVersionId: VersionIdentifier;
  readonly effectiveDate?: Date | null;
  readonly deprecationDate?: Date | null;
  readonly deprecationReason?: string | null;
  readonly auditTrail?: ReadonlyArray<unknown>;
  readonly [key: string]: unknown;
}

export interface ContentLifecycleServiceOptions<
  TContent extends LifecycleManagedContent = LifecycleManagedContent,
> {
  readonly hasConflictingReleasedVersion?: (
    content: TContent,
    fixedVersion: VersionIdentifier,
  ) => boolean;
  readonly isContentReadyForReview?: (content: TContent) => boolean;
  readonly now?: () => Date;
}

export class ContentLifecycleService<
  TContent extends LifecycleManagedContent = LifecycleManagedContent,
> {
  private readonly hasConflictingReleasedVersion: (
    content: TContent,
    fixedVersion: VersionIdentifier,
  ) => boolean;

  private readonly isContentReadyForReview: (content: TContent) => boolean;

  private readonly now: () => Date;

  public constructor(options: ContentLifecycleServiceOptions<TContent> = {}) {
    this.hasConflictingReleasedVersion =
      options.hasConflictingReleasedVersion ?? (() => false);
    this.isContentReadyForReview =
      options.isContentReadyForReview ?? defaultContentReadyForReview;
    this.now = options.now ?? (() => new Date());
  }

  public transitionToReview(
    content: TContent | null | undefined,
    command: SubmitForReviewCommand,
  ): Result<ContentLifecycleTransitionResult<TContent>, ContentLifecycleError> {
    if (content == null) {
      return err({
        kind: 'ContentNotFound',
        contentId: command.contentId,
      });
    }

    const guard = this.canSubmitForReview(content, command);
    if (!guard.allowed) {
      return err(guard.reason);
    }

    return ok(
      this.transition(content, command, ApprovalStatus.InReview, {
        rationale: command.rationale,
      }),
    );
  }

  public approve(
    content: TContent | null | undefined,
    command: ApproveContentCommand,
  ): Result<ContentLifecycleTransitionResult<TContent>, ContentLifecycleError> {
    if (content == null) {
      return err({
        kind: 'ContentNotFound',
        contentId: command.contentId,
      });
    }

    const guard = this.canApprove(content, command);
    if (!guard.allowed) {
      return err(guard.reason);
    }

    return ok(
      this.transition(content, command, ApprovalStatus.Approved, {
        rationale: command.rationale,
      }),
    );
  }

  public release(
    content: TContent | null | undefined,
    command: ReleaseContentCommand,
  ): Result<ContentLifecycleTransitionResult<TContent>, ContentLifecycleError> {
    if (content == null) {
      return err({
        kind: 'ContentNotFound',
        contentId: command.contentId,
      });
    }

    const guard = this.canRelease(content, command);
    if (!guard.allowed) {
      return err(guard.reason);
    }

    return ok(
      this.transition(content, command, ApprovalStatus.Released, {
        currentVersionId: command.fixedVersion,
        effectiveDate: resolveOccurredAt(command.occurredAt, this.now),
        rationale: command.rationale,
        fixedVersion: command.fixedVersion,
      }),
    );
  }

  public deprecate(
    content: TContent | null | undefined,
    command: DeprecateContentCommand,
  ): Result<ContentLifecycleTransitionResult<TContent>, ContentLifecycleError> {
    if (content == null) {
      return err({
        kind: 'ContentNotFound',
        contentId: command.contentId,
      });
    }

    const guard = this.canDeprecate(content, command);
    if (!guard.allowed) {
      return err(guard.reason);
    }

    const occurredAt = resolveOccurredAt(command.occurredAt, this.now);

    return ok(
      this.transition(content, command, ApprovalStatus.Deprecated, {
        deprecationDate: occurredAt,
        deprecationReason: command.deprecationReason.trim(),
        rationale: command.rationale ?? command.deprecationReason,
      }),
    );
  }

  private canSubmitForReview(
    content: TContent,
    command: SubmitForReviewCommand,
  ): GuardResult {
    const organizationGuard = this.assertSameOrganization(content, command);
    if (!organizationGuard.allowed) {
      return organizationGuard;
    }

    const lockedGuard = this.assertMutable(content);
    if (!lockedGuard.allowed) {
      return lockedGuard;
    }

    if (content.approvalStatus !== ApprovalStatus.Draft) {
      return denyGuard(content.approvalStatus, ApprovalStatus.InReview);
    }

    if (!this.isContentReadyForReview(content)) {
      return {
        allowed: false,
        reason: {
          kind: 'InvalidTransition',
          from: content.approvalStatus,
          to: ApprovalStatus.InReview,
        },
      };
    }

    return { allowed: true };
  }

  private canApprove(
    content: TContent,
    command: ApproveContentCommand,
  ): GuardResult {
    const organizationGuard = this.assertSameOrganization(content, command);
    if (!organizationGuard.allowed) {
      return organizationGuard;
    }

    const lockedGuard = this.assertMutable(content);
    if (!lockedGuard.allowed) {
      return lockedGuard;
    }

    if (content.approvalStatus !== ApprovalStatus.InReview) {
      return denyGuard(content.approvalStatus, ApprovalStatus.Approved);
    }

    return { allowed: true };
  }

  private canRelease(
    content: TContent,
    command: ReleaseContentCommand,
  ): GuardResult {
    const organizationGuard = this.assertSameOrganization(content, command);
    if (!organizationGuard.allowed) {
      return organizationGuard;
    }

    const lockedGuard = this.assertMutable(content);
    if (!lockedGuard.allowed) {
      return lockedGuard;
    }

    if (content.approvalStatus !== ApprovalStatus.Approved) {
      return denyGuard(content.approvalStatus, ApprovalStatus.Released);
    }

    if (!hasText(command.fixedVersion)) {
      return {
        allowed: false,
        reason: {
          kind: 'VersionNotFixed',
          contentId: content.id,
        },
      };
    }

    if (this.hasConflictingReleasedVersion(content, command.fixedVersion)) {
      return denyGuard(content.approvalStatus, ApprovalStatus.Released);
    }

    return { allowed: true };
  }

  private canDeprecate(
    content: TContent,
    command: DeprecateContentCommand,
  ): GuardResult {
    const organizationGuard = this.assertSameOrganization(content, command);
    if (!organizationGuard.allowed) {
      return organizationGuard;
    }

    if (content.approvalStatus === ApprovalStatus.Deprecated) {
      return {
        allowed: false,
        reason: {
          kind: 'ContentIsNotEditable',
          contentId: content.id,
          status: ApprovalStatus.Deprecated,
        },
      };
    }

    if (content.approvalStatus !== ApprovalStatus.Released) {
      return denyGuard(content.approvalStatus, ApprovalStatus.Deprecated);
    }

    if (!hasText(command.deprecationReason)) {
      return {
        allowed: false,
        reason: {
          kind: 'MissingDeprecationReason',
          contentId: content.id,
        },
      };
    }

    return { allowed: true };
  }

  private assertSameOrganization(
    content: TContent,
    command: LifecycleCommandBase,
  ): GuardResult {
    if (content.organizationId !== command.organizationId) {
      return {
        allowed: false,
        reason: {
          kind: 'OrganizationMismatch',
          contentOrgId: content.organizationId,
          commandOrgId: command.organizationId,
        },
      };
    }

    return { allowed: true };
  }

  private assertMutable(content: TContent): GuardResult {
    if (content.approvalStatus === ApprovalStatus.Released) {
      return {
        allowed: false,
        reason: {
          kind: 'ContentIsImmutable',
          contentId: content.id,
          status: ApprovalStatus.Released,
        },
      };
    }

    if (content.approvalStatus === ApprovalStatus.Deprecated) {
      return {
        allowed: false,
        reason: {
          kind: 'ContentIsNotEditable',
          contentId: content.id,
          status: ApprovalStatus.Deprecated,
        },
      };
    }

    return { allowed: true };
  }

  private transition(
    content: TContent,
    command: LifecycleCommandBase,
    nextStatus: ApprovalStatusValue,
    overrides: {
      readonly currentVersionId?: VersionIdentifier;
      readonly effectiveDate?: Date | null;
      readonly deprecationDate?: Date | null;
      readonly rationale?: string | null;
      readonly fixedVersion?: VersionIdentifier | null;
      readonly deprecationReason?: string | null;
    },
  ): ContentLifecycleTransitionResult<TContent> {
    const occurredAt = resolveOccurredAt(command.occurredAt, this.now);
    const nextContent = Object.freeze({
      ...content,
      ...overrides,
      organizationId: content.organizationId,
      approvalStatus: nextStatus,
    }) as TContent;

    const audit = Object.freeze({
      contentId: content.id,
      organizationId: content.organizationId,
      actorId: command.actorId,
      timestamp: new Date(occurredAt.getTime()),
      from: content.approvalStatus,
      to: nextStatus,
      priorState: content.approvalStatus,
      rationale: normalizeOptionalText(overrides.rationale ?? command.rationale),
      fixedVersion: overrides.fixedVersion ?? null,
      deprecationReason: normalizeOptionalText(overrides.deprecationReason),
    });

    return Object.freeze({
      content: nextContent,
      audit,
    });
  }
}

function ok<TValue, TError>(value: TValue): Result<TValue, TError> {
  return Object.freeze({
    ok: true,
    value,
  });
}

function err<TValue, TError>(error: TError): Result<TValue, TError> {
  return Object.freeze({
    ok: false,
    error,
  });
}

function denyGuard(
  from: ApprovalStatusValue,
  to: ApprovalStatusValue,
): GuardResult {
  return {
    allowed: false,
    reason: {
      kind: 'InvalidTransition',
      from,
      to,
    },
  };
}

function resolveOccurredAt(
  occurredAt: Date | undefined,
  fallback: () => Date,
): Date {
  const candidate = occurredAt ?? fallback();
  return new Date(candidate.getTime());
}

function hasText(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  return hasText(value) ? value.trim() : null;
}

function defaultContentReadyForReview(content: LifecycleManagedContent): boolean {
  const ignoredKeys = new Set<string>([
    'id',
    'kind',
    'entityType',
    'organizationId',
    'approvalStatus',
    'currentVersionId',
    'effectiveDate',
    'deprecationDate',
    'deprecationReason',
    'auditTrail',
  ]);

  for (const [key, value] of Object.entries(content)) {
    if (ignoredKeys.has(key)) {
      continue;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      return true;
    }

    if (Array.isArray(value) && value.length > 0) {
      return true;
    }

    if (value != null && typeof value === 'object') {
      return true;
    }
  }

  return false;
}
