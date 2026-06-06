import type { VehicleType, SearchVehiclesResponse, VehicleSearchFilters } from '@mvp/contracts';

export type { SearchVehiclesResponse, VehicleSearchFilters };

export interface UseSearchResult {
  results: SearchVehiclesResponse | null;
  isLoading: boolean;
  error: Error | null;
}

export interface SearchFiltersState {
  query: string;
  type: VehicleType | '';
  onlyAvailable: boolean;
}
