import {
  InMemoryUserRepository, SqliteUserRepository,
  InMemoryVehicleRepository, SqliteVehicleRepository,
  InMemoryBookingRepository, SqliteBookingRepository,
  InMemoryRideRepository, SqliteRideRepository,
  InMemoryZoneRepository, SqliteZoneRepository,
  InMemoryFleetZoneRepository, SqliteFleetZoneRepository,
} from '../adapters/repositories'
import {
  JwtAuthService, GeoZoneValidator, HaversineRoutingService,
  StandardPricingService, MockBillingProcessor, StandardPromotionService,
  StandardIncentiveService, FirebasePushSender, MockUnlockService,
  GpsTrackingService, StandardMaintenanceService, StandardSupportService,
  StandardReportingService,
} from '../adapters/services'

const backend = process.env.DB_BACKEND ?? 'memory'

export function buildContainer() {
  const userRepo = backend === 'sqlite' ? new SqliteUserRepository() : new InMemoryUserRepository()
  const vehicleRepo = backend === 'sqlite' ? new SqliteVehicleRepository() : new InMemoryVehicleRepository()
  const bookingRepo = backend === 'sqlite' ? new SqliteBookingRepository() : new InMemoryBookingRepository()
  const rideRepo = backend === 'sqlite' ? new SqliteRideRepository() : new InMemoryRideRepository()
  const zoneRepo = backend === 'sqlite' ? new SqliteZoneRepository() : new InMemoryZoneRepository()
  const fleetZoneRepo = backend === 'sqlite' ? new SqliteFleetZoneRepository() : new InMemoryFleetZoneRepository()

  const authService = new JwtAuthService()
  const zoneValidator = new GeoZoneValidator()
  const routingService = new HaversineRoutingService()
  const pricingService = new StandardPricingService()
  const billingService = new MockBillingProcessor()
  const promotionService = new StandardPromotionService()
  const incentiveService = new StandardIncentiveService()
  const notificationSender = new FirebasePushSender()
  const unlockService = new MockUnlockService()
  const gpsTrackingService = new GpsTrackingService()
  const maintenanceService = new StandardMaintenanceService()
  const supportService = new StandardSupportService()
  const reportingService = new StandardReportingService(rideRepo, fleetZoneRepo)

  return {
    nearbyVehicles: { vehicleRepo },
    bookVehicle: { userRepo, vehicleRepo, bookingRepo },
    estimateRideCost: { vehicleRepo, pricingService, promotionService },
    endRide: { rideRepo, vehicleRepo, zoneRepo, zoneValidator, pricingService, billingService, incentiveService, notificationSender },
    rideSummary: { rideRepo, vehicleRepo },
    vehicleDetails: { vehicleRepo },
    estimateWalkTime: { vehicleRepo, routingService },
    suggestBestVehicle: { vehicleRepo, routingService, zoneValidator, pricingService, zoneRepo },
    applyPromotion: { promotionService },
    openSupportTicket: { supportService },
    reportDamagedVehicle: { maintenanceService, vehicleRepo, notificationSender },
    vehicleBatteryStatus: { vehicleRepo },
    unlockVehicle: { unlockService, bookingRepo, rideRepo, vehicleRepo },
    unlockMethod: { unlockService, vehicleRepo },
    managePaymentMethod: { userRepo, billingService },
    pauseRide: { rideRepo, vehicleRepo },
    usageFrequencyReport: { reportingService },
    mobilityPeriodicReport: { reportingService },
    markUrbanWarningZone: { zoneRepo, notificationSender },
    highDensityZoneMap: { reportingService },
    defineSensitiveZone: { zoneRepo, zoneValidator },
    fleetDistributionMap: { vehicleRepo, fleetZoneRepo, zoneValidator },
    lowAvailabilityAlert: { fleetZoneRepo, notificationSender },
    receiveMalfunctionReport: { maintenanceService },
    verifyParkingPosition: { zoneValidator, gpsTrackingService, vehicleRepo, zoneRepo },
    maintenanceQueue: { maintenanceService },
    vehicleGPSHistory: { gpsTrackingService },
    manageSupportTickets: { supportService, userRepo },
    configureParkingBonus: { incentiveService, fleetZoneRepo },
    suspendUserAccount: { authService, userRepo },
    remoteLockVehicle: { unlockService, vehicleRepo, notificationSender },
    expiredBookingsMonitor: { bookingRepo, vehicleRepo, notificationSender },
  }
}

export const container = buildContainer()
