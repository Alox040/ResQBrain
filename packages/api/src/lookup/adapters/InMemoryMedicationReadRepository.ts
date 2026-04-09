import type { MedicationDetailDto } from '../../../../application/src/lookup/dto/MedicationDetailDto';
import type { MedicationListItemDto } from '../../../../application/src/lookup/dto/MedicationListItemDto';
import type { MedicationReadRepository } from '../../../../application/src/lookup/ports/MedicationReadRepository';
import type { GetMedicationDetailQuery } from '../../../../application/src/lookup/queries/GetMedicationDetailQuery';
import type { GetMedicationListQuery } from '../../../../application/src/lookup/queries/GetMedicationListQuery';
import type { OrgId } from '../../../../domain/src/shared/types';
import {
  MEDICATION_MOCK_DATA,
  type MedicationMockRecord,
} from '../mock-data/medications';
import { LOOKUP_PILOT_ORGANIZATION_ID } from '../mock-data/algorithms';

export class InMemoryMedicationReadRepository implements MedicationReadRepository {
  public async listReleased(
    query: GetMedicationListQuery,
  ): Promise<ReadonlyArray<MedicationListItemDto>> {
    if (!isAuthorizedOrganization(query.organizationId)) {
      return [];
    }

    const records = applyPagination(
      MEDICATION_MOCK_DATA.filter((record) => matchesListQuery(record, query)),
      query.page,
      query.limit,
    );

    return records.map(toListItemDto);
  }

  public async getReleasedById(
    query: GetMedicationDetailQuery,
  ): Promise<MedicationDetailDto | null> {
    if (!isAuthorizedOrganization(query.organizationId)) {
      return null;
    }

    const record =
      MEDICATION_MOCK_DATA.find(
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
  record: MedicationMockRecord,
  query: GetMedicationListQuery,
): boolean {
  return (
    matchesScopedFilters(record, query.regionId, query.stationId, query.versionId) &&
    matchesSearchTerm(record, query.searchTerm)
  );
}

function matchesScopedFilters(
  record: MedicationMockRecord,
  regionId: GetMedicationListQuery['regionId'],
  stationId: GetMedicationListQuery['stationId'],
  versionId: GetMedicationListQuery['versionId'],
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
  record: MedicationMockRecord,
  searchTerm: GetMedicationListQuery['searchTerm'],
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

function toListItemDto(record: MedicationMockRecord): MedicationListItemDto {
  return {
    id: record.id,
    name: record.name,
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

function toDetailDto(record: MedicationMockRecord): MedicationDetailDto {
  return {
    id: record.id,
    name: record.name,
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
