import { Router } from 'express';
import type { HistoryDeps } from './History.types';
import { createHistoryHandler } from './History.handler';

export function createHistoryRouter(deps: HistoryDeps): Router {
  const router = Router();
  const handler = createHistoryHandler(deps);

  router.get('/', async (req, res): Promise<void> => {
    const userId = req.query['userId'] as string | undefined;
    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    try {
      const result = await handler({ userId });
      res.json(result);
    } catch (err: unknown) {
      const e = err as { statusCode?: number; message?: string };
      res.status(e.statusCode ?? 500).json({ error: e.message ?? 'Internal server error' });
    }
  });

  return router;
}
