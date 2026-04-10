export interface AlgorithmSeedRecord {
  readonly id: string;
  readonly title: string;
  readonly summary?: string | null;
  readonly category?: string | null;
  readonly organizationId: string;
  readonly regionId?: string | null;
  readonly stationId?: string | null;
  readonly currentReleasedVersionId: string;
  readonly versionLabel?: string | null;
  readonly lastReleasedAt?: string | null;
  readonly tags?: ReadonlyArray<string>;
  readonly visibility?: string | null;
  readonly scope?: string | null;
}

export interface MedicationSeedRecord {
  readonly id: string;
  readonly name: string;
  readonly summary?: string | null;
  readonly category?: string | null;
  readonly organizationId: string;
  readonly regionId?: string | null;
  readonly stationId?: string | null;
  readonly currentReleasedVersionId: string;
  readonly versionLabel?: string | null;
  readonly lastReleasedAt?: string | null;
  readonly tags?: ReadonlyArray<string>;
  readonly visibility?: string | null;
  readonly scope?: string | null;
}

export interface SearchIndexSeedRecord {
  readonly kind: "algorithm" | "medication";
  readonly id: string;
  readonly title: string;
  readonly summary?: string | null;
  readonly category?: string | null;
  readonly organizationId: string;
  readonly regionId?: string | null;
  readonly stationId?: string | null;
  readonly currentReleasedVersionId: string;
  readonly versionLabel?: string | null;
  readonly lastReleasedAt?: string | null;
  readonly tags?: ReadonlyArray<string>;
  readonly visibility?: string | null;
  readonly scope?: string | null;
}

export interface LookupSeeds {
  readonly algorithms: ReadonlyArray<AlgorithmSeedRecord>;
  readonly medications: ReadonlyArray<MedicationSeedRecord>;
  readonly searchIndex: ReadonlyArray<SearchIndexSeedRecord>;
}
