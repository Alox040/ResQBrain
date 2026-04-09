import type { SearchResultDto } from '../../../../application/src/lookup/dto/SearchResultDto';
import { ALGORITHM_MOCK_DATA } from './algorithms';
import { MEDICATION_MOCK_DATA } from './medications';

export interface LookupSearchIndexRecord extends SearchResultDto {
  readonly kind: 'algorithm' | 'medication';
  readonly searchTerms: ReadonlyArray<string>;
}

const algorithmSearchIndex: ReadonlyArray<LookupSearchIndexRecord> = ALGORITHM_MOCK_DATA.map(
  (algorithm) => ({
    id: algorithm.id,
    title: algorithm.title,
    summary: algorithm.summary,
    category: algorithm.category,
    organizationId: algorithm.organizationId,
    regionId: algorithm.regionId,
    stationId: algorithm.stationId,
    currentReleasedVersionId: algorithm.currentReleasedVersionId,
    versionLabel: algorithm.versionLabel,
    lastReleasedAt: algorithm.lastReleasedAt,
    tags: algorithm.tags,
    visibility: algorithm.visibility,
    scope: algorithm.scope,
    kind: 'algorithm',
    searchTerms: algorithm.searchTerms,
  }),
);

const medicationSearchIndex: ReadonlyArray<LookupSearchIndexRecord> = MEDICATION_MOCK_DATA.map(
  (medication) => ({
    id: medication.id,
    title: medication.name,
    summary: medication.summary,
    category: medication.category,
    organizationId: medication.organizationId,
    regionId: medication.regionId,
    stationId: medication.stationId,
    currentReleasedVersionId: medication.currentReleasedVersionId,
    versionLabel: medication.versionLabel,
    lastReleasedAt: medication.lastReleasedAt,
    tags: medication.tags,
    visibility: medication.visibility,
    scope: medication.scope,
    kind: 'medication',
    searchTerms: medication.searchTerms,
  }),
);

export const LOOKUP_SEARCH_INDEX: ReadonlyArray<LookupSearchIndexRecord> = [
  ...algorithmSearchIndex,
  ...medicationSearchIndex,
];
