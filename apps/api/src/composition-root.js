"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompositionRoot = createCompositionRoot;
const db_1 = require("./db");
const DrizzleVehicleRepository_1 = require("./adapters/db/DrizzleVehicleRepository");
const DrizzleBookingRepository_1 = require("./adapters/db/DrizzleBookingRepository");
const DrizzleRideRepository_1 = require("./adapters/db/DrizzleRideRepository");
const DrizzleUserRepository_1 = require("./adapters/db/DrizzleUserRepository");
const InMemoryFleetZoneRepository_1 = require("./adapters/db/InMemoryFleetZoneRepository");
const MockUnlockService_1 = require("./adapters/services/MockUnlockService");
const MockZoneValidator_1 = require("./adapters/services/MockZoneValidator");
const MockBillingService_1 = require("./adapters/services/MockBillingService");
const MockGpsTrackingService_1 = require("./adapters/services/MockGpsTrackingService");
const NearbyVehicles_router_1 = require("./slices/NearbyVehicles/NearbyVehicles.router");
const VehicleDetails_router_1 = require("./slices/VehicleDetails/VehicleDetails.router");
const BookVehicle_router_1 = require("./slices/BookVehicle/BookVehicle.router");
const UnlockVehicle_router_1 = require("./slices/UnlockVehicle/UnlockVehicle.router");
const EndRide_router_1 = require("./slices/EndRide/EndRide.router");
const PauseRide_router_1 = require("./slices/PauseRide/PauseRide.router");
const RestoreSession_router_1 = require("./slices/RestoreSession/RestoreSession.router");
function createCompositionRoot() {
    // Concrete adapters
    const vehicleRepo = new DrizzleVehicleRepository_1.DrizzleVehicleRepository(db_1.db);
    const bookingRepo = new DrizzleBookingRepository_1.DrizzleBookingRepository(db_1.db);
    const rideRepo = new DrizzleRideRepository_1.DrizzleRideRepository(db_1.db);
    const userRepo = new DrizzleUserRepository_1.DrizzleUserRepository(db_1.db);
    const fleetZoneRepo = new InMemoryFleetZoneRepository_1.InMemoryFleetZoneRepository();
    const unlockService = new MockUnlockService_1.MockUnlockService();
    const zoneValidator = new MockZoneValidator_1.MockZoneValidator();
    const billingService = new MockBillingService_1.MockBillingService();
    const gpsTrackingService = new MockGpsTrackingService_1.MockGpsTrackingService();
    void userRepo;
    void fleetZoneRepo;
    void gpsTrackingService;
    // Wire slice routers with their dependencies
    return {
        nearbyVehiclesRouter: (0, NearbyVehicles_router_1.createNearbyVehiclesRouter)({ vehicleRepo }),
        vehicleDetailsRouter: (0, VehicleDetails_router_1.createVehicleDetailsRouter)({ vehicleRepo }),
        bookVehicleRouter: (0, BookVehicle_router_1.createBookVehicleRouter)({ bookingRepo, vehicleRepo }),
        unlockVehicleRouter: (0, UnlockVehicle_router_1.createUnlockVehicleRouter)({ rideRepo, bookingRepo, vehicleRepo, unlockService, zoneValidator }),
        endRideRouter: (0, EndRide_router_1.createEndRideRouter)({ rideRepo, vehicleRepo, billingService, zoneValidator }),
        pauseRideRouter: (0, PauseRide_router_1.createPauseRideRouter)({ rideRepo, vehicleRepo }),
        restoreSessionRouter: (0, RestoreSession_router_1.createRestoreSessionRouter)({ rideRepo, bookingRepo, vehicleRepo }),
    };
}
