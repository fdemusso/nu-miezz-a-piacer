import { Vehicle, Coordinates } from '@mvp/contracts';

export interface NearbyVehiclesState {
  userLocation: Coordinates | null;
  selectedVehicleId: string | null;
}

export interface UseNearbyVehiclesResult {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
