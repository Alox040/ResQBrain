import type { IncomingMessage } from 'node:http';

export interface ParsedRequest {
  readonly method: string;
  readonly pathname: string;
  readonly request: Record<string, string | number | undefined>;
}

export function parseRequest(
  req: IncomingMessage,
  params: Record<string, string>,
): ParsedRequest | null {
  if (req.url == null) {
    return null;
  }

  const method = req.method ?? 'GET';
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

  return {
    method,
    pathname: url.pathname,
    request: {
      id: params['id'],
      organizationId: getQueryValue(url, 'organizationId'),
      regionId: getQueryValue(url, 'regionId'),
      stationId: getQueryValue(url, 'stationId'),
      searchTerm: getQueryValue(url, 'searchTerm'),
      versionId: getQueryValue(url, 'versionId'),
      page: getOptionalNumber(url, 'page'),
      limit: getOptionalNumber(url, 'limit'),
    },
  };
}

function getQueryValue(url: URL, key: string): string | undefined {
  const value = url.searchParams.get(key);
  return value == null || value.trim() === '' ? undefined : value;
}

function getOptionalNumber(url: URL, key: string): number | undefined {
  const value = getQueryValue(url, key);
  if (value == null) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
