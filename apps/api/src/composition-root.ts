import { db } from './db';
import { DrizzleVehicleRepository } from './adapters/db/DrizzleVehicleRepository';
import { DrizzleBookingRepository } from './adapters/db/DrizzleBookingRepository';
import { DrizzleRideRepository } from './adapters/db/DrizzleRideRepository';
import { DrizzleUserRepository } from './adapters/db/DrizzleUserRepository';
import { InMemoryFleetZoneRepository } from './adapters/db/InMemoryFleetZoneRepository';
import { MockUnlockService } from './adapters/services/MockUnlockService';
import { MockZoneValidator } from './adapters/services/MockZoneValidator';
import { MockBillingService } from './adapters/services/MockBillingService';
import { MockGpsTrackingService } from './adapters/services/MockGpsTrackingService';
import { createNearbyVehiclesRouter } from './slices/NearbyVehicles/NearbyVehicles.router';
import { createVehicleDetailsRouter } from './slices/VehicleDetails/VehicleDetails.router';
import { createBookVehicleRouter } from './slices/BookVehicle/BookVehicle.router';
import { createUnlockVehicleRouter } from './slices/UnlockVehicle/UnlockVehicle.router';
import { createEndRideRouter } from './slices/EndRide/EndRide.router';
import { createPauseRideRouter } from './slices/PauseRide/PauseRide.router';
import { createRestoreSessionRouter } from './slices/RestoreSession/RestoreSession.router';
import { createProfileRouter } from './slices/Profile/Profile.router';
import { createHistoryRouter } from './slices/History/History.router';
import { createSearchRouter } from './slices/Search/Search.router';

export function createCompositionRoot() {
  // Concrete adapters
  const vehicleRepo = new DrizzleVehicleRepository(db);
  const bookingRepo = new DrizzleBookingRepository(db);
  const rideRepo = new DrizzleRideRepository(db);
  const userRepo = new DrizzleUserRepository(db);
  const fleetZoneRepo = new InMemoryFleetZoneRepository();
  const unlockService = new MockUnlockService();
  const zoneValidator = new MockZoneValidator();
  const billingService = new MockBillingService();
  const gpsTrackingService = new MockGpsTrackingService();
  void fleetZoneRepo;
  void gpsTrackingService;

  // Wire slice routers with their dependencies
  return {
    nearbyVehiclesRouter: createNearbyVehiclesRouter({ vehicleRepo }),
    vehicleDetailsRouter: createVehicleDetailsRouter({ vehicleRepo }),
    bookVehicleRouter: createBookVehicleRouter({ bookingRepo, vehicleRepo }),
    unlockVehicleRouter: createUnlockVehicleRouter({ rideRepo, bookingRepo, vehicleRepo, unlockService, zoneValidator }),
    endRideRouter: createEndRideRouter({ rideRepo, vehicleRepo, billingService, zoneValidator }),
    pauseRideRouter: createPauseRideRouter({ rideRepo, vehicleRepo }),
    restoreSessionRouter: createRestoreSessionRouter({ rideRepo, bookingRepo, vehicleRepo }),
    profileRouter: createProfileRouter({ userRepo }),
    historyRouter: createHistoryRouter({ rideRepo }),
    searchRouter: createSearchRouter({ vehicleRepo }),
  };
}
