import { isReleaseSourceApprovalStatus } from '../common/ApprovalStatus';
import type {
  AccessContext,
  AccessPolicyEvaluation,
  AccessSubject,
} from './AccessPolicy';
import { evaluateOrganizationAccess } from './OrganizationScopedAccessPolicy';
import type { ReleaseCandidate } from '../release/Release';
import { isReleaseCandidateWithinOrganization } from '../release/Release';

export interface ReleaseAuthorizationRequest {
  readonly subject: AccessSubject;
  readonly context: AccessContext;
  readonly candidate: ReleaseCandidate;
}

export type ReleaseAuthorizationDenyReason =
  | 'cross-tenant-release-forbidden'
  | 'releaser-role-required'
  | 'package-release-permission-required'
  | 'candidate-package-not-approved'
  | 'candidate-not-in-organization-scope';

export interface ReleaseAuthorizationDecision {
  readonly allowed: boolean;
  readonly evaluation: AccessPolicyEvaluation;
  readonly denyReason?: ReleaseAuthorizationDenyReason;
}

export function authorizeRelease(
  request: ReleaseAuthorizationRequest,
): ReleaseAuthorizationDecision {
  const accessDecision = evaluateOrganizationAccess({
    subject: request.subject,
    context: request.context,
    permission: 'package.release',
    role: 'Releaser',
  });

  if (
    !isReleaseCandidateWithinOrganization(request.candidate, request.context)
  ) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: 'candidate-not-in-organization-scope',
    };
  }

  if (!isReleaseSourceApprovalStatus(request.candidate.packageApprovalStatus)) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: 'candidate-package-not-approved',
    };
  }

  if (!accessDecision.organizationScoped) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: 'cross-tenant-release-forbidden',
    };
  }

  if (!accessDecision.hasRequiredRole) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: 'releaser-role-required',
    };
  }

  if (!accessDecision.hasRequiredPermission) {
    return {
      allowed: false,
      evaluation: accessDecision.evaluation,
      denyReason: 'package-release-permission-required',
    };
  }

  return {
    allowed: true,
    evaluation: accessDecision.evaluation,
  };
}
