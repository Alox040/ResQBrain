import type { LookupSearchRepository } from '../../../../application/src/lookup/ports/LookupSearchRepository';
import type { SearchLookupContentQuery } from '../../../../application/src/lookup/queries/SearchLookupContentQuery';
import type { SearchResultDto } from '../../../../application/src/lookup/dto/SearchResultDto';
import type { OrgId } from '../../../../domain/src/shared/types';
import {
  LOOKUP_SEARCH_INDEX,
  type LookupSearchIndexRecord,
} from '../mock-data/search-index';
import { LOOKUP_PILOT_ORGANIZATION_ID } from '../mock-data/algorithms';

export class InMemoryLookupSearchRepository implements LookupSearchRepository {
  public async searchReleased(
    query: SearchLookupContentQuery,
  ): Promise<ReadonlyArray<SearchResultDto>> {
    if (!isAuthorizedOrganization(query.organizationId)) {
      return [];
    }

    const records = applyPagination(
      LOOKUP_SEARCH_INDEX.filter((record) => matchesSearchQuery(record, query)),
      query.page,
      query.limit,
    );

    return records.map(toSearchResultDto);
  }
}

function isAuthorizedOrganization(organizationId: OrgId): boolean {
  return organizationId === LOOKUP_PILOT_ORGANIZATION_ID;
}

function matchesSearchQuery(
  record: LookupSearchIndexRecord,
  query: SearchLookupContentQuery,
): boolean {
  return (
    matchesScopedFilters(record, query.regionId, query.stationId, query.versionId) &&
    matchesSearchTerm(record, query.searchTerm)
  );
}

function matchesScopedFilters(
  record: LookupSearchIndexRecord,
  regionId: SearchLookupContentQuery['regionId'],
  stationId: SearchLookupContentQuery['stationId'],
  versionId: SearchLookupContentQuery['versionId'],
): boolean {
  if (regionId != null && record.regionId !== regionId) {
    return false;
  }

  if (stationId != null && record.stationId !== stationId) {
    return false;
  }

  if (versionId != null && record.currentReleasedVersionId !== versionId) {
    return false;
  }

  return true;
}

function matchesSearchTerm(
  record: LookupSearchIndexRecord,
  searchTerm: SearchLookupContentQuery['searchTerm'],
): boolean {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (normalizedSearchTerm === '') {
    return true;
  }

  return record.searchTerms.some((term) => term.toLowerCase().includes(normalizedSearchTerm));
}

function applyPagination<T>(
  records: ReadonlyArray<T>,
  page: number | null | undefined,
  limit: number | null | undefined,
): ReadonlyArray<T> {
  if (page == null || limit == null || limit <= 0 || page <= 0) {
    return records;
  }

  const startIndex = (page - 1) * limit;
  return records.slice(startIndex, startIndex + limit);
}

function toSearchResultDto(record: LookupSearchIndexRecord): SearchResultDto {
  return {
    kind: record.kind,
    id: record.id,
    title: record.title,
    summary: record.summary,
    category: record.category,
    organizationId: record.organizationId,
    regionId: record.regionId,
    stationId: record.stationId,
    currentReleasedVersionId: record.currentReleasedVersionId,
    versionLabel: record.versionLabel,
    lastReleasedAt: record.lastReleasedAt,
    tags: record.tags,
    visibility: record.visibility,
    scope: record.scope,
  };
}
