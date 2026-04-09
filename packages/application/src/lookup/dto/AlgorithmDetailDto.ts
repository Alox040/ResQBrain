import type { OrgId, RegionId, StationId, VersionId } from '../../../../domain/src/shared/types';

export interface AlgorithmDetailDto {
  readonly id: string;
  readonly title: string;
  readonly summary?: string | null;
  readonly category?: string | null;
  readonly organizationId: OrgId;
  readonly regionId?: RegionId | null;
  readonly stationId?: StationId | null;
  readonly currentReleasedVersionId: VersionId;
  readonly versionLabel?: string | null;
  readonly lastReleasedAt?: string | null;
  readonly tags?: ReadonlyArray<string>;
  readonly visibility?: string | null;
  readonly scope?: string | null;
}
