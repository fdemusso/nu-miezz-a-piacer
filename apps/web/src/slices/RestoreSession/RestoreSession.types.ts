import { Ride, Booking, Vehicle } from '@mvp/contracts';

export interface SessionSnapshot {
  ride: Ride | null;
  booking: Booking | null;
  vehicle: Vehicle | null;
}
