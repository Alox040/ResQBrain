import type {
  CountyId,
  OrgId,
  RegionId,
  SurveyInsightId,
} from '../../shared/types';

import { DomainError } from '../../shared/errors';
import { validateOptionalIntraOrgRef } from '../../tenant/policies';
import type { County, Region } from '../../tenant/entities';

import type { SurveyInsightKind } from './InsightType';
import type { SurveyInsightConfidence } from './SurveyConfidence';
import type { SurveyInsightTargetEntityType } from './SurveyTargetEntityType';

export interface SurveyInsightTargetRef {
  readonly id: string;
  readonly organizationId: OrgId;
}

export interface SurveyInsight {
  readonly id: SurveyInsightId;
  readonly organizationId: OrgId;
  readonly regionId: RegionId | null;
  readonly countyId: CountyId | null;
  readonly targetEntityType: SurveyInsightTargetEntityType;
  readonly targetEntityId: string | null;
  readonly insightType: SurveyInsightKind;
  readonly confidence: SurveyInsightConfidence;
  readonly value: number;
  readonly sourceRef: string;
  readonly importedAt: Date;
  readonly versionWindow: string | null;
  readonly rawPayload: Readonly<Record<string, unknown>> | null;
  readonly governanceLocked: true;
}

export interface CreateSurveyInsightInput {
  readonly id: SurveyInsightId;
  readonly organizationId: OrgId;
  readonly region?: Pick<Region, 'id' | 'organizationId'> | null;
  readonly county?: Pick<County, 'id' | 'organizationId' | 'regionId'> | null;
  readonly targetEntityType: SurveyInsightTargetEntityType;
  readonly targetEntity?: SurveyInsightTargetRef | null;
  readonly insightType: SurveyInsightKind;
  readonly confidence: SurveyInsightConfidence;
  readonly value: number;
  readonly sourceRef: string;
  readonly importedAt: Date;
  readonly versionWindow?: string | null;
  readonly rawPayload?: Readonly<Record<string, unknown>> | null;
}

export function createSurveyInsight(
  input: CreateSurveyInsightInput,
): SurveyInsight {
  const organizationId = assertOrgId(input.organizationId);
  const scopeAnchor = { organizationId } as const;

  validateOptionalIntraOrgRef(scopeAnchor, input.region);
  validateOptionalIntraOrgRef(scopeAnchor, input.county);
  validateOptionalIntraOrgRef(scopeAnchor, input.targetEntity);

  if (
    input.region &&
    input.county?.regionId &&
    input.county.regionId !== input.region.id
  ) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'SurveyInsight region and county hierarchy must be consistent.',
      {
        organizationId,
        regionId: input.region.id,
        countyRegionId: input.county.regionId,
      },
    );
  }

  return Object.freeze({
    id: assertEntityId(input.id, 'SurveyInsight.id'),
    organizationId,
    regionId: input.region?.id ?? null,
    countyId: input.county?.id ?? null,
    targetEntityType: input.targetEntityType,
    targetEntityId: input.targetEntity
      ? assertNonEmptyString(input.targetEntity.id, 'SurveyInsight.targetEntityId')
      : null,
    insightType: input.insightType,
    confidence: input.confidence,
    value: assertFiniteNumber(input.value, 'SurveyInsight.value'),
    sourceRef: assertNonEmptyString(input.sourceRef, 'SurveyInsight.sourceRef'),
    importedAt: cloneDate(input.importedAt, 'SurveyInsight.importedAt'),
    versionWindow: normalizeOptionalText(
      input.versionWindow,
      'SurveyInsight.versionWindow',
    ),
    rawPayload: freezeRawPayload(input.rawPayload),
    governanceLocked: true,
  });
}

function freezeRawPayload(
  payload: Readonly<Record<string, unknown>> | null | undefined,
): Readonly<Record<string, unknown>> | null {
  if (payload == null) {
    return null;
  }

  if (typeof payload !== 'object' || Array.isArray(payload)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      'SurveyInsight.rawPayload must be a JSON object when provided.',
      {
        field: 'rawPayload',
      },
    );
  }

  return deepFreezeRecord(payload);
}

function deepFreezeRecord(
  value: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  const clone: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(value)) {
    clone[key] = deepFreezeValue(entry);
  }

  return Object.freeze(clone);
}

function deepFreezeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return Object.freeze(value.map((entry) => deepFreezeValue(entry)));
  }

  if (value && typeof value === 'object') {
    return deepFreezeRecord(value as Readonly<Record<string, unknown>>);
  }

  return value;
}

function assertOrgId(value: OrgId): OrgId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(
      'MISSING_ORGANIZATION_CONTEXT',
      'SurveyInsight.organizationId is required.',
    );
  }

  return value;
}

function assertEntityId<TId extends string>(value: TId, field: string): TId {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
      field,
    });
  }

  return value;
}

function assertNonEmptyString(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
      field,
    });
  }

  return value.trim();
}

function assertFiniteNumber(value: number, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} must be a finite number.`,
      {
        field,
      },
    );
  }

  return value;
}

function normalizeOptionalText(
  value: string | null | undefined,
  field: string,
): string | null {
  if (value == null) {
    return null;
  }

  return assertNonEmptyString(value, field);
}

function cloneDate(value: Date, field: string): Date {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new DomainError(
      'DATA_INTEGRITY_VIOLATION',
      `${field} must be a valid Date.`,
      {
        field,
      },
    );
  }

  return new Date(value.getTime());
}
