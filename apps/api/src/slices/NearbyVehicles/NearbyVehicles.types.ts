import { Vehicle, Coordinates } from '@mvp/contracts';

export interface NearbyVehiclesQuery {
  lat: number;
  lng: number;
  radiusKm?: number;
}

export interface NearbyVehiclesResponse {
  vehicles: Vehicle[];
  userLocation: Coordinates;
  radiusKm: number;
}

export interface NearbyVehiclesDeps {
  vehicleRepo: import('@mvp/contracts').IVehicleRepository;
}
