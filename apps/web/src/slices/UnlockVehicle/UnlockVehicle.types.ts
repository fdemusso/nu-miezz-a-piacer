import { Ride } from '@mvp/contracts';

export interface UseUnlockVehicleResult {
  unlock: (bookingId: string, userId: string, coords: { lat: number; lng: number }) => Promise<void>;
  ride: Ride | null;
  isPending: boolean;
  error: Error | null;
}
