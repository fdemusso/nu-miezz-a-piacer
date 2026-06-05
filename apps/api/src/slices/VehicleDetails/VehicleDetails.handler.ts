import { Request, Response } from 'express';
import { VehicleDetailsDeps } from './VehicleDetails.types';

export function createVehicleDetailsHandler(deps: VehicleDetailsDeps) {
  return async (req: Request, res: Response): Promise<void> => {
    const { vehicleId } = req.params;

    const vehicle = await deps.vehicleRepo.findById(vehicleId!);
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.json({ vehicle });
  };
}
