import type { IVehicleRepository, VehicleSearchFilters, SearchVehiclesResponse } from '@mvp/contracts';

export interface SearchInput {
  filters: VehicleSearchFilters;
}

export type SearchOutput = SearchVehiclesResponse;

export interface SearchDeps {
  vehicleRepo: IVehicleRepository;
}
