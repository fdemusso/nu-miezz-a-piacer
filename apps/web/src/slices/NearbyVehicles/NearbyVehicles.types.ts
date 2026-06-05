import { NearbyVehiclesItem, NearbyVehiclesResponse, Coordinates } from '@mvp/contracts';

export type { NearbyVehiclesItem, NearbyVehiclesResponse };

export interface UseNearbyVehiclesResult {
  vehicles: NearbyVehiclesItem[];
  isLoading: boolean;
  error: Error | null;
  usingFallback: boolean;
  userPosition: Coordinates | null;
  refetch: () => void;
}
