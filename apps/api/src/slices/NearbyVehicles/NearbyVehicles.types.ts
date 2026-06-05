import { Coordinates, NearbyVehiclesResponse } from '@mvp/contracts';

export interface NearbyVehiclesQuery {
  lat: number;
  lng: number;
  radiusKm?: number;
}

export type { NearbyVehiclesResponse };

export interface NearbyVehiclesDeps {
  vehicleRepo: import('@mvp/contracts').IVehicleRepository;
}

export type UserPosition = Coordinates;
