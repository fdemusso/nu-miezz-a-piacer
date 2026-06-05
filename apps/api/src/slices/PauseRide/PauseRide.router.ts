import { Router } from 'express';
import { PauseRideDeps } from './PauseRide.types';
import { createPauseRideHandler, createResumeRideHandler } from './PauseRide.handler';

export function createPauseRideRouter(deps: PauseRideDeps): Router {
  const router = Router();
  router.post('/:rideId/pause', createPauseRideHandler(deps));
  router.post('/:rideId/resume', createResumeRideHandler(deps));
  return router;
}
