import { Request, Response } from 'express';
import { BookingStatus, RideStatus, VehicleStatus } from '@mvp/contracts';
import { UnlockVehicleDeps } from './UnlockVehicle.types';

export function createUnlockVehicleHandler(deps: UnlockVehicleDeps) {
  return async (req: Request, res: Response): Promise<void> => {
    const { userId, bookingId, startLat, startLng } = req.body as {
      userId: string;
      bookingId: string;
      startLat: number;
      startLng: number;
    };

    if (!userId || !bookingId || startLat == null || startLng == null) {
      res.status(400).json({ error: 'userId, bookingId, startLat, startLng required' });
      return;
    }

    const booking = await deps.bookingRepo.findById(bookingId);
    if (!booking || booking.userId !== userId || booking.status !== BookingStatus.CONFIRMED) {
      res.status(404).json({ error: 'Valid confirmed booking not found' });
      return;
    }

    const inZone = await deps.zoneValidator.isInServiceZone({ lat: startLat, lng: startLng });
    if (!inZone) {
      res.status(422).json({ error: 'Location outside service zone' });
      return;
    }

    const ride = await deps.rideRepo.create({
      userId,
      vehicleId: booking.vehicleId,
      bookingId,
      status: RideStatus.ACTIVE,
      startedAt: new Date(),
      startLocation: { lat: startLat, lng: startLng },
    });

    const { success, unlockCode } = await deps.unlockService.unlock(booking.vehicleId, ride.id);
    if (!success) {
      res.status(502).json({ error: 'Failed to unlock vehicle' });
      return;
    }

    await deps.bookingRepo.updateStatus(bookingId, BookingStatus.CONVERTED_TO_RIDE);
    await deps.vehicleRepo.updateStatus(booking.vehicleId, VehicleStatus.IN_USE);

    res.status(201).json({ ride, unlockCode });
  };
}
