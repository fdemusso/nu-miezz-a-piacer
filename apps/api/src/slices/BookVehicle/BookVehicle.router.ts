import { Router } from 'express';
import { BookVehicleDeps } from './BookVehicle.types';
import { createBookVehicleHandler, createCancelBookingHandler } from './BookVehicle.handler';

export function createBookVehicleRouter(deps: BookVehicleDeps): Router {
  const router = Router();
  router.post('/', createBookVehicleHandler(deps));
  router.delete('/:id', createCancelBookingHandler(deps));
  return router;
}
