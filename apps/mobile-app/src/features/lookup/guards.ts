import type {
  LookupAlgorithmDetail,
  LookupAlgorithmListItem,
  LookupMedicationDetail,
  LookupMedicationListItem,
  LookupSearchResponse,
  LookupSearchResultItem,
  LookupScopedContentRecord,
} from "@/lib/lookup-api/types";

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

function isScopedContentRecord(value: unknown): value is LookupScopedContentRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.organizationId === "string" &&
    typeof value.currentReleasedVersionId === "string" &&
    isOptionalString(value.summary) &&
    isOptionalString(value.category) &&
    isOptionalString(value.regionId) &&
    isOptionalString(value.stationId) &&
    isOptionalString(value.versionLabel) &&
    isOptionalString(value.lastReleasedAt) &&
    isOptionalStringArray(value.tags) &&
    isOptionalString(value.visibility) &&
    isOptionalString(value.scope)
  );
}

function assertValidResponse(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertLookupAlgorithmListResponse(
  value: unknown,
): asserts value is { items: LookupAlgorithmListItem[]; page: number; limit: number } {
  assertValidResponse(
    isRecord(value) &&
      Array.isArray(value.items) &&
      typeof value.page === "number" &&
      typeof value.limit === "number" &&
      value.items.every((item) => {
        if (!isScopedContentRecord(item) || !isRecord(item)) {
          return false;
        }

        return typeof item.title === "string";
      }),
    "Lookup-Antwort fuer Algorithmen ist ungueltig.",
  );
}

export function assertLookupMedicationListResponse(
  value: unknown,
): asserts value is { items: LookupMedicationListItem[]; page: number; limit: number } {
  assertValidResponse(
    isRecord(value) &&
      Array.isArray(value.items) &&
      typeof value.page === "number" &&
      typeof value.limit === "number" &&
      value.items.every((item) => {
        if (!isScopedContentRecord(item) || !isRecord(item)) {
          return false;
        }

        return typeof item.name === "string";
      }),
    "Lookup-Antwort fuer Medikamente ist ungueltig.",
  );
}

export function assertLookupAlgorithmDetail(
  value: unknown,
): asserts value is LookupAlgorithmDetail {
  assertValidResponse(
    isScopedContentRecord(value) &&
      isRecord(value) &&
      typeof value.title === "string",
    "Lookup-Detailantwort fuer den Algorithmus ist ungueltig.",
  );
}

export function assertLookupMedicationDetail(
  value: unknown,
): asserts value is LookupMedicationDetail {
  assertValidResponse(
    isScopedContentRecord(value) &&
      isRecord(value) &&
      typeof value.name === "string",
    "Lookup-Detailantwort fuer das Medikament ist ungueltig.",
  );
}

export function assertLookupSearchItems(
  value: unknown,
): asserts value is LookupSearchResultItem[] {
  assertValidResponse(
    Array.isArray(value) &&
      value.every((item) => {
        if (!isScopedContentRecord(item) || !isRecord(item)) {
          return false;
        }

        return typeof item.title === "string";
      }),
    "Lookup-Antwort fuer die Suche ist ungueltig.",
  );
}

export function assertLookupSearchResponse(
  value: unknown,
): asserts value is LookupSearchResponse {
  assertValidResponse(
    isRecord(value) &&
      Array.isArray(value.items) &&
      typeof value.page === "number" &&
      typeof value.limit === "number",
    "Lookup-Suchergebnis hat ein ungueltiges Format.",
  );
}
