import type { MedicationDetailDto } from '../../../../application/src/lookup/dto/MedicationDetailDto';
import type { MedicationListItemDto } from '../../../../application/src/lookup/dto/MedicationListItemDto';
import type { MedicationReadRepository } from '../../../../application/src/lookup/ports/MedicationReadRepository';
import type { GetMedicationDetailQuery } from '../../../../application/src/lookup/queries/GetMedicationDetailQuery';
import type { GetMedicationListQuery } from '../../../../application/src/lookup/queries/GetMedicationListQuery';
import type { OrgId, RegionId, StationId, VersionId } from '../../../../domain/src/shared/types';
import { loadLookupSeeds } from '../seeds/loadLookupSeeds';
import type { MedicationSeedRecord } from '../seeds/types';

export class SeedMedicationReadRepository implements MedicationReadRepository {
  readonly #records: ReadonlyArray<MedicationSeedRecord>;
  readonly #organizationIds: ReadonlySet<OrgId>;

  constructor(seedDir?: string) {
    const seeds = loadLookupSeeds(seedDir);
    this.#records = seeds.medications;
    this.#organizationIds = new Set(
      this.#records.map((record) => record.organizationId as OrgId),
    );
  }

  public async listReleased(
    query: GetMedicationListQuery,
  ): Promise<ReadonlyArray<MedicationListItemDto>> {
    if (!isAuthorizedOrganization(this.#organizationIds, query.organizationId)) {
      return [];
    }

    const records = applyPagination(
      this.#records.filter((record) => matchesListQuery(record, query)),
      query.page,
      query.limit,
    );

    return records.map(toListItemDto);
  }

  public async getReleasedById(
    query: GetMedicationDetailQuery,
  ): Promise<MedicationDetailDto | null> {
    if (!isAuthorizedOrganization(this.#organizationIds, query.organizationId)) {
      return null;
    }

    const record =
      this.#records.find(
        (entry) =>
          entry.id === query.entityId &&
          matchesScopedFilters(entry, query.regionId, query.stationId, query.versionId),
      ) ?? null;

    return record === null ? null : toDetailDto(record);
  }
}

function isAuthorizedOrganization(
  organizationIds: ReadonlySet<OrgId>,
  organizationId: OrgId,
): boolean {
  return organizationIds.has(organizationId);
}

function matchesListQuery(
  record: MedicationSeedRecord,
  query: GetMedicationListQuery,
): boolean {
  return (
    matchesScopedFilters(record, query.regionId, query.stationId, query.versionId) &&
    matchesSearchTerm(record, query.searchTerm)
  );
}

function matchesScopedFilters(
  record: MedicationSeedRecord,
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
  record: MedicationSeedRecord,
  searchTerm: GetMedicationListQuery['searchTerm'],
): boolean {
  if (searchTerm == null || searchTerm.trim() === '') {
    return true;
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return (
    record.name.toLowerCase().includes(normalizedSearchTerm) ||
    record.summary?.toLowerCase().includes(normalizedSearchTerm) === true ||
    record.tags?.some((tag) => tag.toLowerCase().includes(normalizedSearchTerm)) === true
  );
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

function toListItemDto(record: MedicationSeedRecord): MedicationListItemDto {
  return {
    id: record.id,
    name: record.name,
    summary: record.summary,
    category: record.category,
    organizationId: record.organizationId as OrgId,
    regionId: (record.regionId ?? null) as RegionId | null,
    stationId: (record.stationId ?? null) as StationId | null,
    currentReleasedVersionId: record.currentReleasedVersionId as VersionId,
    versionLabel: record.versionLabel ?? null,
    lastReleasedAt: record.lastReleasedAt ?? null,
    tags: record.tags,
    visibility: record.visibility ?? null,
    scope: record.scope ?? null,
  };
}

function toDetailDto(record: MedicationSeedRecord): MedicationDetailDto {
  return {
    id: record.id,
    name: record.name,
    summary: record.summary,
    category: record.category,
    organizationId: record.organizationId as OrgId,
    regionId: (record.regionId ?? null) as RegionId | null,
    stationId: (record.stationId ?? null) as StationId | null,
    currentReleasedVersionId: record.currentReleasedVersionId as VersionId,
    versionLabel: record.versionLabel ?? null,
    lastReleasedAt: record.lastReleasedAt ?? null,
    tags: record.tags,
    visibility: record.visibility ?? null,
    scope: record.scope ?? null,
  };
}
