import { Router } from 'express';
import { ProfileDeps } from './Profile.types';
import { createProfileHandler } from './Profile.handler';

export function createProfileRouter(deps: ProfileDeps): Router {
  const router = Router();
  const handler = createProfileHandler(deps);

  router.get('/', async (req, res) => {
    const userId = req.query['userId'];
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    try {
      const output = await handler({ userId });
      res.json(output);
    } catch (err: unknown) {
      const e = err as { statusCode?: number; message?: string };
      res.status(e.statusCode ?? 500).json({ error: e.message ?? 'Internal server error' });
    }
  });

  return router;
}
