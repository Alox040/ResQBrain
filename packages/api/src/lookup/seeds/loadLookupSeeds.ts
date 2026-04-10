import { readFileSync } from "node:fs";
import path from "node:path";
import type {
  AlgorithmSeedRecord,
  LookupSeeds,
  MedicationSeedRecord,
  SearchIndexSeedRecord,
} from "./types";

const DEFAULT_LOOKUP_SEED_DIR = path.resolve(
  process.cwd(),
  "data/seeds/lookup",
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOptionalString(value: unknown) {
  return value == null || typeof value === "string";
}

function isOptionalStringArray(value: unknown) {
  return (
    value == null ||
    (Array.isArray(value) && value.every((entry) => typeof entry === "string"))
  );
}

function readJsonFile(filePath: string): unknown {
  let raw: string;

  try {
    raw = readFileSync(filePath, "utf8");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Lookup-Seed-Datei konnte nicht gelesen werden: ${filePath} (${message})`,
    );
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Lookup-Seed-Datei ist kein gueltiges JSON: ${filePath} (${message})`,
    );
  }
}

function assertArrayFile(
  value: unknown,
  filePath: string,
): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Lookup-Seed-Datei muss ein Array enthalten: ${filePath}`);
  }
}

function assertAlgorithmSeedRecord(
  value: unknown,
  filePath: string,
  index: number,
): asserts value is AlgorithmSeedRecord {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.organizationId !== "string" ||
    typeof value.currentReleasedVersionId !== "string" ||
    !isOptionalString(value.summary) ||
    !isOptionalString(value.category) ||
    !isOptionalString(value.regionId) ||
    !isOptionalString(value.stationId) ||
    !isOptionalString(value.versionLabel) ||
    !isOptionalString(value.lastReleasedAt) ||
    !isOptionalStringArray(value.tags) ||
    !isOptionalString(value.visibility) ||
    !isOptionalString(value.scope)
  ) {
    throw new Error(
      `Ungueltiger Algorithmus-Seed in ${filePath} an Index ${index}. Erwartet werden mindestens id, title, organizationId und currentReleasedVersionId.`,
    );
  }
}

function assertMedicationSeedRecord(
  value: unknown,
  filePath: string,
  index: number,
): asserts value is MedicationSeedRecord {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.organizationId !== "string" ||
    typeof value.currentReleasedVersionId !== "string" ||
    !isOptionalString(value.summary) ||
    !isOptionalString(value.category) ||
    !isOptionalString(value.regionId) ||
    !isOptionalString(value.stationId) ||
    !isOptionalString(value.versionLabel) ||
    !isOptionalString(value.lastReleasedAt) ||
    !isOptionalStringArray(value.tags) ||
    !isOptionalString(value.visibility) ||
    !isOptionalString(value.scope)
  ) {
    throw new Error(
      `Ungueltiger Medikament-Seed in ${filePath} an Index ${index}. Erwartet werden mindestens id, name, organizationId und currentReleasedVersionId.`,
    );
  }
}

function assertSearchIndexSeedRecord(
  value: unknown,
  filePath: string,
  index: number,
): asserts value is SearchIndexSeedRecord {
  if (
    !isRecord(value) ||
    (value.kind !== "algorithm" && value.kind !== "medication") ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.organizationId !== "string" ||
    typeof value.currentReleasedVersionId !== "string" ||
    !isOptionalString(value.summary) ||
    !isOptionalString(value.category) ||
    !isOptionalString(value.regionId) ||
    !isOptionalString(value.stationId) ||
    !isOptionalString(value.versionLabel) ||
    !isOptionalString(value.lastReleasedAt) ||
    !isOptionalStringArray(value.tags) ||
    !isOptionalString(value.visibility) ||
    !isOptionalString(value.scope)
  ) {
    throw new Error(
      `Ungueltiger Search-Index-Seed in ${filePath} an Index ${index}. Erwartet werden mindestens kind, id, title, organizationId und currentReleasedVersionId.`,
    );
  }
}

function loadAlgorithmSeeds(seedDir: string): ReadonlyArray<AlgorithmSeedRecord> {
  const filePath = path.join(seedDir, "algorithms.json");
  const parsed = readJsonFile(filePath);
  assertArrayFile(parsed, filePath);

  const records = parsed.map((entry, index) => {
    assertAlgorithmSeedRecord(entry, filePath, index);
    return entry;
  });

  return records;
}

function loadMedicationSeeds(seedDir: string): ReadonlyArray<MedicationSeedRecord> {
  const filePath = path.join(seedDir, "medications.json");
  const parsed = readJsonFile(filePath);
  assertArrayFile(parsed, filePath);

  const records = parsed.map((entry, index) => {
    assertMedicationSeedRecord(entry, filePath, index);
    return entry;
  });

  return records;
}

function loadSearchIndexSeeds(seedDir: string): ReadonlyArray<SearchIndexSeedRecord> {
  const filePath = path.join(seedDir, "search-index.json");
  const parsed = readJsonFile(filePath);
  assertArrayFile(parsed, filePath);

  const records = parsed.map((entry, index) => {
    assertSearchIndexSeedRecord(entry, filePath, index);
    return entry;
  });

  return records;
}

export function loadLookupSeeds(seedDir = DEFAULT_LOOKUP_SEED_DIR): LookupSeeds {
  return {
    algorithms: loadAlgorithmSeeds(seedDir),
    medications: loadMedicationSeeds(seedDir),
    searchIndex: loadSearchIndexSeeds(seedDir),
  };
}
