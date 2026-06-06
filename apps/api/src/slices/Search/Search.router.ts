import { Router } from 'express';
import { VehicleType } from '@mvp/contracts';
import type { SearchDeps } from './Search.types';
import { createSearchHandler } from './Search.handler';

export function createSearchRouter(deps: SearchDeps): Router {
  const router = Router();
  const handler = createSearchHandler(deps);

  router.get('/search', async (req, res) => {
    const { query, type, onlyAvailable } = req.query;

    if (type !== undefined && !Object.values(VehicleType).includes(type as VehicleType)) {
      res.status(400).json({ error: `Invalid type. Valid values: ${Object.values(VehicleType).join(', ')}` });
      return;
    }

    try {
      const output = await handler({
        filters: {
          query: typeof query === 'string' && query.trim() ? query.trim() : undefined,
          type: type ? (type as VehicleType) : undefined,
          onlyAvailable: onlyAvailable === 'true',
        },
      });
      res.json(output);
    } catch (err: unknown) {
      const e = err as { statusCode?: number; message?: string };
      res.status(e.statusCode ?? 500).json({ error: e.message ?? 'Internal server error' });
    }
  });

  return router;
}
