import { Request, Response } from 'express';
import { RideStatus, VehicleStatus } from '@mvp/contracts';
import { PauseRideDeps } from './PauseRide.types';

export function createPauseRideHandler(deps: PauseRideDeps) {
  return async (req: Request, res: Response): Promise<void> => {
    const rideId = req.params['rideId']!;
    const { userId } = req.body as { userId: string };

    const ride = await deps.rideRepo.findById(rideId);
    if (!ride || ride.userId !== userId || ride.status !== RideStatus.ACTIVE) {
      res.status(404).json({ error: 'Active ride not found' });
      return;
    }

    await deps.rideRepo.updateStatus(rideId, RideStatus.PAUSED);
    // Vehicle stays IN_USE — still assigned to rider during pause
    await deps.vehicleRepo.updateStatus(ride.vehicleId, VehicleStatus.IN_USE);

    const updated = await deps.rideRepo.findById(rideId);
    res.json({ ride: updated });
  };
}

export function createResumeRideHandler(deps: PauseRideDeps) {
  return async (req: Request, res: Response): Promise<void> => {
    const rideId = req.params['rideId']!;
    const { userId } = req.body as { userId: string };

    const ride = await deps.rideRepo.findById(rideId);
    if (!ride || ride.userId !== userId || ride.status !== RideStatus.PAUSED) {
      res.status(404).json({ error: 'Paused ride not found' });
      return;
    }

    await deps.rideRepo.updateStatus(rideId, RideStatus.ACTIVE);
    await deps.vehicleRepo.updateStatus(ride.vehicleId, VehicleStatus.IN_USE);

    const updated = await deps.rideRepo.findById(rideId);
    res.json({ ride: updated });
  };
}
