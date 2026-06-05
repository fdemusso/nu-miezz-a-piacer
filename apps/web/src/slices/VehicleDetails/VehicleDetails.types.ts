import { Vehicle } from '@mvp/contracts';

export interface UseVehicleDetailsResult {
  vehicle: Vehicle | null;
  isLoading: boolean;
  error: Error | null;
}
