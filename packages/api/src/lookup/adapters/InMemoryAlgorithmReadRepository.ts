import type { AlgorithmDetailDto } from '../../../../application/src/lookup/dto/AlgorithmDetailDto';
import type { AlgorithmListItemDto } from '../../../../application/src/lookup/dto/AlgorithmListItemDto';
import type { AlgorithmReadRepository } from '../../../../application/src/lookup/ports/AlgorithmReadRepository';
import type { GetAlgorithmDetailQuery } from '../../../../application/src/lookup/queries/GetAlgorithmDetailQuery';
import type { GetAlgorithmListQuery } from '../../../../application/src/lookup/queries/GetAlgorithmListQuery';
import type { OrgId } from '../../../../domain/src/shared/types';
import {
  ALGORITHM_MOCK_DATA,
  type AlgorithmMockRecord,
  LOOKUP_PILOT_ORGANIZATION_ID,
} from '../mock-data/algorithms';

export class InMemoryAlgorithmReadRepository implements AlgorithmReadRepository {
  public async listReleased(
    query: GetAlgorithmListQuery,
  ): Promise<ReadonlyArray<AlgorithmListItemDto>> {
    if (!isAuthorizedOrganization(query.organizationId)) {
      return [];
    }

    const records = applyPagination(
      ALGORITHM_MOCK_DATA.filter((record) => matchesListQuery(record, query)),
      query.page,
      query.limit,
    );

    return records.map(toListItemDto);
  }

  public async getReleasedById(
    query: GetAlgorithmDetailQuery,
  ): Promise<AlgorithmDetailDto | null> {
    if (!isAuthorizedOrganization(query.organizationId)) {
      return null;
    }

    const record =
      ALGORITHM_MOCK_DATA.find(
        (entry) =>
          entry.id === query.entityId &&
          matchesScopedFilters(entry, query.regionId, query.stationId, query.versionId),
      ) ?? null;

    return record === null ? null : toDetailDto(record);
  }
}

function isAuthorizedOrganization(organizationId: OrgId): boolean {
  return organizationId === LOOKUP_PILOT_ORGANIZATION_ID;
}

function matchesListQuery(
  record: AlgorithmMockRecord,
  query: GetAlgorithmListQuery,
): boolean {
  return (
    matchesScopedFilters(record, query.regionId, query.stationId, query.versionId) &&
    matchesSearchTerm(record, query.searchTerm)
  );
}

function matchesScopedFilters(
  record: AlgorithmMockRecord,
  regionId: GetAlgorithmListQuery['regionId'],
  stationId: GetAlgorithmListQuery['stationId'],
  versionId: GetAlgorithmListQuery['versionId'],
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
  record: AlgorithmMockRecord,
  searchTerm: GetAlgorithmListQuery['searchTerm'],
): boolean {
  if (searchTerm == null || searchTerm.trim() === '') {
    return true;
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

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

function toListItemDto(record: AlgorithmMockRecord): AlgorithmListItemDto {
  return {
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

function toDetailDto(record: AlgorithmMockRecord): AlgorithmDetailDto {
  return {
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
