import type {
  LookupAlgorithmDetail,
  LookupAlgorithmsResponse,
  LookupApiErrorPayload,
  LookupMedicationDetail,
  LookupMedicationsResponse,
  LookupSearchResponse,
} from "@/lib/lookup-api/types";

const DEFAULT_LOOKUP_API_BASE_URL = "http://localhost:3001";

function getLookupApiBaseUrl() {
  const configuredBaseUrl =
    process.env.LOOKUP_API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_LOOKUP_API_BASE_URL?.trim();

  if (configuredBaseUrl && configuredBaseUrl.startsWith("http")) {
    return configuredBaseUrl.replace(/\/+$/, "");
  }

  return DEFAULT_LOOKUP_API_BASE_URL;
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export class LookupApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly uiMessage: string;

  constructor({
    code,
    message,
    status,
    uiMessage,
  }: {
    code?: string;
    message: string;
    status: number;
    uiMessage: string;
  }) {
    super(message);
    this.name = "LookupApiClientError";
    this.status = status;
    this.code = code ?? "LOOKUP_API_ERROR";
    this.uiMessage = uiMessage;
  }
}

export function getLookupApiErrorMessage(error: unknown) {
  if (error instanceof LookupApiClientError) {
    return error.uiMessage;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Lookup-Daten konnten nicht geladen werden.";
}

async function lookupGet<TResponse>(path: string, query?: Record<string, string | number | undefined>) {
  const url = `${getLookupApiBaseUrl()}${path}${query ? buildQuery(query) : ""}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
  } catch {
    throw new LookupApiClientError({
      message: `Lookup API request failed for ${path}`,
      status: 0,
      uiMessage: "Lookup-API ist nicht erreichbar.",
    });
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as LookupApiErrorPayload | null;
    const code = payload?.error?.code;
    const message = payload?.error?.message || `Request failed with status ${response.status}`;

    throw new LookupApiClientError({
      code,
      message,
      status: response.status,
      uiMessage: payload?.error?.message || "Lookup-Daten konnten nicht geladen werden.",
    });
  }

  return (await response.json()) as TResponse;
}

export function listAlgorithms(params?: {
  organizationId?: string;
  regionId?: string;
  stationId?: string;
  searchTerm?: string;
  page?: number;
}) {
  return lookupGet<LookupAlgorithmsResponse>("/api/algorithms", params);
}

export function getAlgorithmDetail(
  id: string,
  params?: { organizationId?: string; regionId?: string; stationId?: string },
) {
  return lookupGet<LookupAlgorithmDetail>(`/api/algorithms/${encodeURIComponent(id)}`, params);
}

export function listMedications(params?: {
  organizationId?: string;
  regionId?: string;
  stationId?: string;
  searchTerm?: string;
  page?: number;
}) {
  return lookupGet<LookupMedicationsResponse>("/api/medications", params);
}

export function getMedicationDetail(
  id: string,
  params?: { organizationId?: string; regionId?: string; stationId?: string },
) {
  return lookupGet<LookupMedicationDetail>(`/api/medications/${encodeURIComponent(id)}`, params);
}

export async function searchLookup(params: {
  organizationId?: string;
  regionId?: string;
  stationId?: string;
  searchTerm: string;
}) {
  const body = await lookupGet<LookupSearchResponse>("/api/search", params);
  return body.items;
}
