import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { DomainError, TenantIsolationViolation } from '../shared/errors';
import { createAlgorithm, ApprovalStatus } from '../content';
import { createSurveyInsight, SurveyInsightKind, SurveyInsightConfidence, SurveyInsightTargetEntityType, } from './index';
const orgA = 'org-A';
const orgB = 'org-B';
test('T-SUR-01/P-11: SurveyInsight creation has no write path into content lifecycle state', () => {
    const algorithm = createAlgorithm({
        id: 'alg-1',
        organizationId: orgA,
        title: 'Airway Decision',
        currentVersionId: 'ver-1',
        approvalStatus: ApprovalStatus.Released,
    });
    const insight = createSurveyInsight({
        id: 'survey-1',
        organizationId: orgA,
        targetEntityType: SurveyInsightTargetEntityType.ALGORITHM,
        targetEntity: {
            id: algorithm.id,
            organizationId: algorithm.organizationId,
        },
        insightType: SurveyInsightKind.ISSUE,
        confidence: SurveyInsightConfidence.HIGH,
        value: 7,
        sourceRef: 'survey-batch-2026-03-31',
        importedAt: new Date('2026-03-31T08:00:00.000Z'),
    });
    assert.equal(insight.targetEntityId, algorithm.id);
    assert.equal(insight.governanceLocked, true);
    assert.equal(algorithm.approvalStatus, ApprovalStatus.Released);
});
test('T-SUR-02/SG-04/L-08: SurveyInsight rejects targetEntity references from another organization', () => {
    assert.throws(() => createSurveyInsight({
        id: 'survey-2',
        organizationId: orgA,
        targetEntityType: SurveyInsightTargetEntityType.ALGORITHM,
        targetEntity: {
            id: 'alg-foreign',
            organizationId: orgB,
        },
        insightType: SurveyInsightKind.DEMAND,
        confidence: SurveyInsightConfidence.MEDIUM,
        value: 3,
        sourceRef: 'survey-batch-2026-03-31',
        importedAt: new Date('2026-03-31T08:00:00.000Z'),
    }), (error) => error instanceof TenantIsolationViolation);
});
test('T-SUR-03/L-08: SurveyInsight rejects region and county references from another organization', () => {
    assert.throws(() => createSurveyInsight({
        id: 'survey-3',
        organizationId: orgA,
        region: {
            id: 'region-foreign',
            organizationId: orgB,
        },
        targetEntityType: SurveyInsightTargetEntityType.FEATURE,
        insightType: SurveyInsightKind.VOTE,
        confidence: SurveyInsightConfidence.LOW,
        value: 11,
        sourceRef: 'survey-batch-2026-03-31',
        importedAt: new Date('2026-03-31T08:00:00.000Z'),
    }), (error) => error instanceof TenantIsolationViolation);
    assert.throws(() => createSurveyInsight({
        id: 'survey-4',
        organizationId: orgA,
        county: {
            id: 'county-foreign',
            organizationId: orgB,
        },
        targetEntityType: SurveyInsightTargetEntityType.FEATURE,
        insightType: SurveyInsightKind.VOTE,
        confidence: SurveyInsightConfidence.LOW,
        value: 11,
        sourceRef: 'survey-batch-2026-03-31',
        importedAt: new Date('2026-03-31T08:00:00.000Z'),
    }), (error) => error instanceof TenantIsolationViolation);
});
test('SurveyInsight enforces import foundation invariants and append-only immutability', () => {
    const importedAt = new Date('2026-03-31T08:00:00.000Z');
    const insight = createSurveyInsight({
        id: 'survey-5',
        organizationId: orgA,
        region: {
            id: 'region-1',
            organizationId: orgA,
        },
        county: {
            id: 'county-1',
            organizationId: orgA,
            regionId: 'region-1',
        },
        targetEntityType: SurveyInsightTargetEntityType.GUIDELINE,
        targetEntity: {
            id: 'guide-1',
            organizationId: orgA,
        },
        insightType: SurveyInsightKind.GAP,
        confidence: SurveyInsightConfidence.MEDIUM,
        value: 12.5,
        sourceRef: 'survey-batch-2026-03-31',
        importedAt,
        versionWindow: '2026-Q2',
        rawPayload: {
            answers: [{ score: 5 }],
            source: { batch: 'survey-batch-2026-03-31' },
        },
    });
    importedAt.setUTCFullYear(2030);
    assert.equal(insight.organizationId, orgA);
    assert.equal(insight.regionId, 'region-1');
    assert.equal(insight.countyId, 'county-1');
    assert.equal(insight.targetEntityId, 'guide-1');
    assert.equal(insight.governanceLocked, true);
    assert.equal(insight.versionWindow, '2026-Q2');
    assert.equal(insight.importedAt.toISOString(), '2026-03-31T08:00:00.000Z');
    assert.ok(insight.rawPayload);
    assert.equal(Object.isFrozen(insight), true);
    assert.equal(Object.isFrozen(insight.rawPayload), true);
    assert.equal(Object.isFrozen(insight.rawPayload?.source), true);
    assert.equal(Object.isFrozen(insight.rawPayload?.answers), true);
    assert.throws(() => {
        insight.value = 99;
    });
});
test('SurveyInsight rejects invalid import data and inconsistent scope hierarchy', () => {
    assert.throws(() => createSurveyInsight({
        id: 'survey-6',
        organizationId: orgA,
        targetEntityType: SurveyInsightTargetEntityType.FEATURE,
        insightType: SurveyInsightKind.VOTE,
        confidence: SurveyInsightConfidence.MEDIUM,
        value: Number.NaN,
        sourceRef: 'survey-batch-2026-03-31',
        importedAt: new Date('2026-03-31T08:00:00.000Z'),
    }), (error) => error instanceof DomainError &&
        error.code === 'DATA_INTEGRITY_VIOLATION');
    assert.throws(() => createSurveyInsight({
        id: 'survey-7',
        organizationId: orgA,
        region: {
            id: 'region-1',
            organizationId: orgA,
        },
        county: {
            id: 'county-1',
            organizationId: orgA,
            regionId: 'region-2',
        },
        targetEntityType: SurveyInsightTargetEntityType.FEATURE,
        insightType: SurveyInsightKind.VOTE,
        confidence: SurveyInsightConfidence.MEDIUM,
        value: 1,
        sourceRef: 'survey-batch-2026-03-31',
        importedAt: new Date('2026-03-31T08:00:00.000Z'),
    }), (error) => error instanceof DomainError &&
        error.code === 'DATA_INTEGRITY_VIOLATION');
});
test('T-SUR-05/T-SUR-06: survey foundation imports neither governance, lifecycle, release nor services', () => {
    const surveyFiles = [
        'entities/InsightType.ts',
        'entities/SurveyConfidence.ts',
        'entities/SurveyTargetEntityType.ts',
        'entities/SurveyInsight.ts',
        'entities/index.ts',
        'index.ts',
    ];
    for (const fileName of surveyFiles) {
        const source = readFileSync(join(process.cwd(), 'src/survey', fileName), 'utf8');
        assert.equal(/from ['"].*governance\//.test(source), false, `${fileName} must not import governance/*`);
        assert.equal(/from ['"].*lifecycle\//.test(source), false, `${fileName} must not import lifecycle/*`);
        assert.equal(/from ['"].*release\//.test(source), false, `${fileName} must not import release/*`);
        assert.equal(/from ['"].*services\//.test(source), false, `${fileName} must not import service layers`);
    }
});
