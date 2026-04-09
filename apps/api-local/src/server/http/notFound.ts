import type { ServerResponse } from 'node:http';

import { writeJson } from './writeJson';

export function notFound(res: ServerResponse): void {
  writeJson(res, 404, {
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found.',
    },
  });
}
