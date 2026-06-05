import { Ride } from '@mvp/contracts';

export interface EndRideBody {
  userId: string;
  endLat: number;
  endLng: number;
  distanceKm: number;
}

export interface EndRideResponse {
  ride: Ride;
  totalCost: import('@mvp/contracts').Money;
}

export interface EndRideDeps {
  rideRepo: import('@mvp/contracts').IRideRepository;
  vehicleRepo: import('@mvp/contracts').IVehicleRepository;
  billingService: import('@mvp/contracts').IBillingService;
  zoneValidator: import('@mvp/contracts').IZoneValidator;
}
