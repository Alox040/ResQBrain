import { createServer as createNodeServer, type Server } from 'node:http';

import { createLookupRoutes, createLookupServices } from '../../../../packages/api/src/index';

import { notFound } from './http/notFound';
import { routeLookupRequest } from './routeLookupRequest';

export function createServer(): Server {
  const routes = createLookupRoutes(createLookupServices());

  return createNodeServer(async (req, res) => {
    const wasHandled = await routeLookupRequest(req, res, routes);

    if (!wasHandled) {
      notFound(res);
    }
  });
}
