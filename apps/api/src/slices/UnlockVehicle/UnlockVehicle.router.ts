import { Router } from 'express';
import { UnlockVehicleDeps } from './UnlockVehicle.types';
import { createUnlockVehicleHandler } from './UnlockVehicle.handler';

export function createUnlockVehicleRouter(deps: UnlockVehicleDeps): Router {
  const router = Router();
  router.post('/unlock', createUnlockVehicleHandler(deps));
  return router;
}
