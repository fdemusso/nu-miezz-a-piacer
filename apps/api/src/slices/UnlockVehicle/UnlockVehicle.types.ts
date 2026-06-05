import { Ride } from '@mvp/contracts';

export interface UnlockVehicleBody {
  userId: string;
  bookingId: string;
  startLat: number;
  startLng: number;
}

export interface UnlockVehicleResponse {
  ride: Ride;
  unlockCode?: string;
}

export interface UnlockVehicleDeps {
  rideRepo: import('@mvp/contracts').IRideRepository;
  bookingRepo: import('@mvp/contracts').IBookingRepository;
  vehicleRepo: import('@mvp/contracts').IVehicleRepository;
  unlockService: import('@mvp/contracts').IUnlockService;
  zoneValidator: import('@mvp/contracts').IZoneValidator;
}
