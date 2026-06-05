import { Router } from 'express';
import { BookVehicleDeps } from './BookVehicle.types';
import { createBookVehicleHandler } from './BookVehicle.handler';

export function createBookVehicleRouter(deps: BookVehicleDeps): Router {
  const router = Router();
  router.post('/', createBookVehicleHandler(deps));
  return router;
}
