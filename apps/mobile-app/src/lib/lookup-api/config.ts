const DEFAULT_LOOKUP_API_BASE_URL = "http://localhost:3001";

export const LOOKUP_API_BASE_URL =
  process.env.EXPO_PUBLIC_LOOKUP_API_BASE_URL?.trim() || DEFAULT_LOOKUP_API_BASE_URL;

export function getLookupApiBaseUrl() {
  if (LOOKUP_API_BASE_URL.startsWith("http")) {
    return LOOKUP_API_BASE_URL.replace(/\/+$/, "");
  }

  return DEFAULT_LOOKUP_API_BASE_URL;
}
