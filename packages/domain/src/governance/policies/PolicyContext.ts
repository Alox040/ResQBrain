import type { ApprovalStatus, ScopeTarget } from '../../content/entities';
import type { PolicyWarning } from '../../shared/types';
import type { OrganizationStatus, ScopeLevel } from '../../tenant/entities';
import type { EntityType } from '../../versioning/entities';
import type {
  ApprovalDecision,
  ApprovalPolicy,
  Capability,
  Permission,
  UserRole,
} from '../entities';

export interface ActorContext {
  readonly userId: string;
  readonly organizationId: string | null | undefined;
  readonly roles: ReadonlyArray<UserRole>;
  readonly permissions: ReadonlyArray<Permission>;
}

export interface PolicyOrganizationContext {
  readonly id: string;
  readonly status: OrganizationStatus;
}

export interface ScopedTarget {
  readonly scopeLevel: ScopeLevel;
  readonly scopeTargetId?: string | null;
}

export interface PolicyContext {
  readonly actor: ActorContext;
  readonly organizationId: string | null | undefined;
  readonly organization?: PolicyOrganizationContext | null;
  readonly capability: Capability;
  readonly entityId: string;
  readonly entityType: EntityType;
  readonly targetScope?: ScopedTarget | ScopeTarget | null;
  readonly targetUserId?: string | null;
}

export interface TransitionContext {
  readonly actor: ActorContext;
  readonly organizationId: string | null | undefined;
  readonly organization?: PolicyOrganizationContext | null;
  readonly entityId: string;
  readonly entityType: EntityType;
  readonly currentState: ApprovalStatus;
  readonly targetState: ApprovalStatus;
  readonly submittedBy?: string | null;
  readonly requireSeparationOfDuty?: boolean;
  readonly structurallyComplete?: boolean;
  readonly hasDeprecatedReference?: boolean;
  readonly rationale?: string | null;
  readonly quorumResolved?: boolean;
  readonly referencedByReleasedPackage?: boolean;
  readonly targetScope?: ScopedTarget | ScopeTarget | null;
}

export interface ReleaseCompositionEntryContext {
  readonly entityId: string;
  readonly entityType: EntityType;
  readonly versionId: string;
  readonly organizationId: string;
  readonly currentVersionId: string;
  readonly approvalStatus: ApprovalStatus;
}

export interface ScopeReferenceContext {
  readonly scopeLevel: ScopeLevel;
  readonly scopeTargetId?: string | null;
  readonly organizationId: string;
  readonly active: boolean;
}

export interface ReleaseContext {
  readonly actor: ActorContext;
  readonly organizationId: string | null | undefined;
  readonly organization?: PolicyOrganizationContext | null;
  readonly packageId: string;
  readonly packageVersionId: string;
  readonly packageApprovalStatus: ApprovalStatus;
  readonly packageEntityType: EntityType;
  readonly approvedByUserIds: ReadonlyArray<string>;
  readonly composition: ReadonlyArray<ReleaseCompositionEntryContext>;
  readonly scopeReferences: ReadonlyArray<ScopeReferenceContext>;
  readonly hasConflictingActiveRelease: boolean;
  readonly hasHardBlockingDependency: boolean;
  readonly rollbackSourceExists?: boolean;
  readonly rollbackContainsDeprecatedEntries?: boolean;
  readonly warningDependencies?: ReadonlyArray<PolicyWarning>;
}

export interface ApprovalContext {
  readonly actor?: ActorContext;
  readonly organizationId: string | null | undefined;
  readonly entityId: string;
  readonly entityType: EntityType;
  readonly currentVersionId: string;
  readonly policy?: ApprovalPolicy | null;
  readonly decisions: ReadonlyArray<ApprovalDecision>;
}

export interface DeprecationContext {
  readonly actor: ActorContext;
  readonly organizationId: string | null | undefined;
  readonly organization?: PolicyOrganizationContext | null;
  readonly entityId: string;
  readonly entityType: EntityType;
  readonly currentState: ApprovalStatus;
  readonly deprecationDate?: Date | null;
  readonly deprecationReason?: string | null;
  readonly warnings?: ReadonlyArray<PolicyWarning>;
}
