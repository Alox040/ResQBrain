import type { CountyId, RegionId, StationId } from '../../shared/types';

import { DomainError } from '../../shared/errors';
import { ScopeLevel } from '../../tenant/entities';

export interface OrganizationScopeTarget {
  readonly scopeLevel: ScopeLevel.ORGANIZATION;
  readonly scopeTargetId?: null | undefined;
}

export interface RegionScopeTarget {
  readonly scopeLevel: ScopeLevel.REGION;
  readonly scopeTargetId: RegionId;
}

export interface CountyScopeTarget {
  readonly scopeLevel: ScopeLevel.COUNTY;
  readonly scopeTargetId: CountyId;
}

export interface StationScopeTarget {
  readonly scopeLevel: ScopeLevel.STATION;
  readonly scopeTargetId: StationId;
}

export type ScopeTarget =
  | OrganizationScopeTarget
  | RegionScopeTarget
  | CountyScopeTarget
  | StationScopeTarget;

export function createScopeTarget(input: ScopeTarget): ScopeTarget {
  if (input == null || typeof input !== 'object') {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ScopeTarget is required.',
    );
  }

  if (input.scopeLevel === ScopeLevel.ORGANIZATION) {
    if (input.scopeTargetId != null) {
      throw new DomainError(
        'DATA_INTEGRITY_VIOLATION',
        'Organization scope must not define scopeTargetId.',
      );
    }

    return Object.freeze({
      scopeLevel: ScopeLevel.ORGANIZATION,
    });
  }

  const scopeLevel = input.scopeLevel;

  if (
    scopeLevel !== ScopeLevel.REGION &&
    scopeLevel !== ScopeLevel.COUNTY &&
    scopeLevel !== ScopeLevel.STATION
  ) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'ScopeTarget.scopeLevel is invalid.',
      { scopeLevel },
    );
  }

  const scopedInput = input as RegionScopeTarget | CountyScopeTarget | StationScopeTarget;

  return Object.freeze({
    scopeLevel: scopedInput.scopeLevel,
    scopeTargetId: assertNonEmptyId(
      scopedInput.scopeTargetId as string,
      'scopeTargetId',
    ),
  }) as ScopeTarget;
}

export function createScopeTargets(
  entries: ReadonlyArray<ScopeTarget> | undefined,
): ReadonlyArray<ScopeTarget> {
  return Object.freeze((entries ?? []).map((entry) => createScopeTarget(entry)));
}

function assertNonEmptyId<TValue extends string>(value: TValue, field: string): TValue {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} is required.`,
      { field },
    );
  }

  return value;
}
