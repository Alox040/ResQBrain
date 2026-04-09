import type { IncomingMessage, ServerResponse } from 'node:http';

import type { LookupRoute } from '../../../../packages/api/src/index';
import { parseRequest } from './http/parseRequest';
import { writeJson, type JsonValue } from './http/writeJson';

type RouteResult = {
  readonly status: number;
  readonly body: unknown;
};

export async function routeLookupRequest(
  req: IncomingMessage,
  res: ServerResponse,
  routes: ReadonlyArray<LookupRoute>,
): Promise<boolean> {
  const parsedRequest = parseRequest(req, {});
  if (parsedRequest == null || parsedRequest.method !== 'GET') {
    return false;
  }

  const match = findRoute(routes, parsedRequest.method, parsedRequest.pathname);

  if (match == null) {
    return false;
  }

  try {
    const matchedRequest = parseRequest(req, match.params);
    if (matchedRequest == null) {
      return false;
    }

    const result = await (match.route.handle as unknown as (
      request: unknown,
    ) => Promise<RouteResult>)(matchedRequest.request);

    writeJson(res, result.status, result.body as JsonValue);
    return true;
  } catch (error) {
    writeJson(res, 500, {
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Internal server error.',
      },
    });
    return true;
  }
}

function findRoute(
  availableRoutes: ReadonlyArray<LookupRoute>,
  method: string,
  pathname: string,
): { readonly route: LookupRoute; readonly params: Record<string, string> } | null {
  for (const route of availableRoutes) {
    if (route.method !== method) {
      continue;
    }

    const params = matchPath(route.path, pathname);
    if (params != null) {
      return { route, params };
    }
  }

  return null;
}

function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = splitPath(pattern);
  const pathParts = splitPath(pathname);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

function splitPath(pathname: string): string[] {
  return pathname.split('/').filter((segment) => segment.length > 0);
}
