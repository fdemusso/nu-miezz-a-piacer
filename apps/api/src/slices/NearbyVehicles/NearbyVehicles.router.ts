import { Router } from 'express';
import { NearbyVehiclesDeps } from './NearbyVehicles.types';
import { createNearbyVehiclesHandler } from './NearbyVehicles.handler';

export function createNearbyVehiclesRouter(deps: NearbyVehiclesDeps): Router {
  const router = Router();
  router.get('/nearby', createNearbyVehiclesHandler(deps));
  return router;
}
