import { Router } from 'express';
import { RestoreSessionDeps } from './RestoreSession.types';
import { createRestoreSessionHandler } from './RestoreSession.handler';

export function createRestoreSessionRouter(deps: RestoreSessionDeps): Router {
  const router = Router();
  router.get('/', createRestoreSessionHandler(deps));
  return router;
}
