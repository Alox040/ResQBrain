import { DomainError } from '../../shared/errors';
import { validateOptionalIntraOrgRef } from '../../tenant/policies';
export function createSurveyInsight(input) {
    const organizationId = assertOrgId(input.organizationId);
    const scopeAnchor = { organizationId };
    validateOptionalIntraOrgRef(scopeAnchor, input.region);
    validateOptionalIntraOrgRef(scopeAnchor, input.county);
    validateOptionalIntraOrgRef(scopeAnchor, input.targetEntity);
    if (input.region &&
        input.county?.regionId &&
        input.county.regionId !== input.region.id) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'SurveyInsight region and county hierarchy must be consistent.', {
            organizationId,
            regionId: input.region.id,
            countyRegionId: input.county.regionId,
        });
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
        versionWindow: normalizeOptionalText(input.versionWindow, 'SurveyInsight.versionWindow'),
        rawPayload: freezeRawPayload(input.rawPayload),
        governanceLocked: true,
    });
}
function freezeRawPayload(payload) {
    if (payload == null) {
        return null;
    }
    if (typeof payload !== 'object' || Array.isArray(payload)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', 'SurveyInsight.rawPayload must be a JSON object when provided.', {
            field: 'rawPayload',
        });
    }
    return deepFreezeRecord(payload);
}
function deepFreezeRecord(value) {
    const clone = {};
    for (const [key, entry] of Object.entries(value)) {
        clone[key] = deepFreezeValue(entry);
    }
    return Object.freeze(clone);
}
function deepFreezeValue(value) {
    if (Array.isArray(value)) {
        return Object.freeze(value.map((entry) => deepFreezeValue(entry)));
    }
    if (value && typeof value === 'object') {
        return deepFreezeRecord(value);
    }
    return value;
}
function assertOrgId(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('MISSING_ORGANIZATION_CONTEXT', 'SurveyInsight.organizationId is required.');
    }
    return value;
}
function assertEntityId(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
            field,
        });
    }
    return value;
}
function assertNonEmptyString(value, field) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} is required.`, {
            field,
        });
    }
    return value.trim();
}
function assertFiniteNumber(value, field) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a finite number.`, {
            field,
        });
    }
    return value;
}
function normalizeOptionalText(value, field) {
    if (value == null) {
        return null;
    }
    return assertNonEmptyString(value, field);
}
function cloneDate(value, field) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        throw new DomainError('DATA_INTEGRITY_VIOLATION', `${field} must be a valid Date.`, {
            field,
        });
    }
    return new Date(value.getTime());
}
