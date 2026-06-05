import { Ride, Money } from '@mvp/contracts';

export interface UseEndRideResult {
  endRide: (rideId: string, userId: string, coords: { lat: number; lng: number }, distanceKm: number) => Promise<void>;
  endedRide: Ride | null;
  totalCost: Money | null;
  isPending: boolean;
  error: Error | null;
}
