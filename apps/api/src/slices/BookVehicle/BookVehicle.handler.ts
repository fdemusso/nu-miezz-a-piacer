import { Request, Response } from 'express';
import { BOOKING_EXPIRY_MINUTES } from '@mvp/config';
import { BookingStatus, VehicleStatus } from '@mvp/contracts';
import { BookVehicleDeps } from './BookVehicle.types';

export function createBookVehicleHandler(deps: BookVehicleDeps) {
  return async (req: Request, res: Response): Promise<void> => {
    const { userId, vehicleId } = req.body as { userId: string; vehicleId: string };

    if (!userId || !vehicleId) {
      res.status(400).json({ error: 'userId and vehicleId are required' });
      return;
    }

    const vehicle = await deps.vehicleRepo.findById(vehicleId);
    if (!vehicle || vehicle.status !== VehicleStatus.AVAILABLE) {
      res.status(409).json({ error: 'Vehicle not available' });
      return;
    }

    const existing = await deps.bookingRepo.findActiveByUserId(userId);
    if (existing) {
      res.status(409).json({ error: 'User already has an active booking' });
      return;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + BOOKING_EXPIRY_MINUTES * 60 * 1000);

    const booking = await deps.bookingRepo.create({
      userId,
      vehicleId,
      status: BookingStatus.CONFIRMED,
      expiresAt,
      confirmedAt: now,
    });

    await deps.vehicleRepo.updateStatus(vehicleId, VehicleStatus.RESERVED);

    res.status(201).json({ booking });
  };
}
