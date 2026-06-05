import { Router } from 'express';
import { EndRideDeps } from './EndRide.types';
import { createEndRideHandler } from './EndRide.handler';

export function createEndRideRouter(deps: EndRideDeps): Router {
  const router = Router();
  router.post('/:rideId/end', createEndRideHandler(deps));
  return router;
}
