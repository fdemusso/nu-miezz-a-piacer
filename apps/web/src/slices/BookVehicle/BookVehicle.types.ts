import { Booking } from '@mvp/contracts';

export interface BookVehicleFormValues {
  vehicleId: string;
  userId: string;
}

export interface UseBookVehicleResult {
  book: (vehicleId: string, userId: string) => Promise<void>;
  booking: Booking | null;
  isPending: boolean;
  error: Error | null;
}
