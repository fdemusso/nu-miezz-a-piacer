import { Router } from 'express';
import { VehicleDetailsDeps } from './VehicleDetails.types';
import { createVehicleDetailsHandler } from './VehicleDetails.handler';

export function createVehicleDetailsRouter(deps: VehicleDetailsDeps): Router {
  const router = Router();
  router.get('/:vehicleId', createVehicleDetailsHandler(deps));
  return router;
}
