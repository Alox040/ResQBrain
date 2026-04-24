import { getLookupApiBaseUrl } from "@/lib/lookup-api/config";
import type {
  LookupAlgorithmDetail,
  LookupAlgorithmsResponse,
  LookupApiErrorPayload,
  LookupMedicationDetail,
  LookupMedicationsResponse,
  LookupSearchResponse,
} from "@/lib/lookup-api/types";

type LookupListParams = {
  organizationId?: string;
  regionId?: string;
  stationId?: string;
  searchTerm?: string;
  page?: number;
};

type LookupScopeParams = {
  organizationId?: string;
  regionId?: string;
  stationId?: string;
};

const LOOKUP_HTTP_DISABLED_MESSAGE =
  "Phase-0 Lookup HTTP client ist deaktiviert. Verwende den Embedded-Bundle-Pfad ueber ensureContentStoreReady().";

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

async function lookupGet<TResponse>(
  path: string,
  query?: Record<string, string | number | undefined>,
): Promise<TResponse> {
  const url = `${getLookupApiBaseUrl()}${path}${query ? buildQuery(query) : ""}`;
  void url;

  throw new LookupApiClientError({
    code: "LOOKUP_HTTP_DISABLED",
    message: `${LOOKUP_HTTP_DISABLED_MESSAGE} Path: ${path}`,
    status: 0,
    uiMessage: LOOKUP_HTTP_DISABLED_MESSAGE,
  });
}

export function listAlgorithms(params?: LookupListParams) {
  return lookupGet<LookupAlgorithmsResponse>("/api/algorithms", params);
}

export function getAlgorithmDetail(id: string, params?: LookupScopeParams) {
  return lookupGet<LookupAlgorithmDetail>(`/api/algorithms/${encodeURIComponent(id)}`, params);
}

export function listMedications(params?: LookupListParams) {
  return lookupGet<LookupMedicationsResponse>("/api/medications", params);
}

export function getMedicationDetail(id: string, params?: LookupScopeParams) {
  return lookupGet<LookupMedicationDetail>(`/api/medications/${encodeURIComponent(id)}`, params);
}

export async function searchLookup(
  params: LookupScopeParams & {
    searchTerm: string;
  },
) {
  const body = await lookupGet<LookupSearchResponse>("/api/search", params);
  return body.items;
}
