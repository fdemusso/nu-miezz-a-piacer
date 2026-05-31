import {
  SqliteUserRepository, SqliteVehicleRepository, SqliteBookingRepository,
  SqliteRideRepository, SqliteZoneRepository, SqliteFleetZoneRepository,
} from '../adapters/repositories'
import {
  JwtAuthService, GeoZoneValidator, HaversineRoutingService,
  StandardPricingService, MockBillingProcessor, StandardPromotionService,
  StandardIncentiveService, FirebasePushSender, MockUnlockService,
  GpsTrackingService, StandardMaintenanceService, StandardSupportService,
  StandardReportingService,
} from '../adapters/services'

function buildContainer() {

  // Repositories
  const userRepo = new SqliteUserRepository()
  const vehicleRepo = new SqliteVehicleRepository()
  const bookingRepo = new SqliteBookingRepository()
  const rideRepo = new SqliteRideRepository()
  const zoneRepo = new SqliteZoneRepository()
  const fleetZoneRepo = new SqliteFleetZoneRepository()

  // Services
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
  const reportingService = new StandardReportingService()

  return {
    nearbyVehicles: {
      vehicleRepo: vehicleRepo,
      gpsTrackingService: gpsTrackingService,
      fleetZoneRepo: fleetZoneRepo
    },
    bookVehicle: {
      userRepo: userRepo,
      vehicleRepo: vehicleRepo,
      bookingRepo: bookingRepo
    },
    estimateRideCost: {
      vehicleRepo: vehicleRepo,
      pricingService: pricingService,
      promotionService: promotionService
    },
    endRide: {
      rideRepo: rideRepo,
      vehicleRepo: vehicleRepo,
      zoneValidator: zoneValidator,
      billingService: billingService,
      incentiveService: incentiveService,
      notificationSender: notificationSender
    },
    rideSummary: {
      rideRepo: rideRepo,
      vehicleRepo: vehicleRepo
    },
    vehicleDetails: {
      vehicleRepo: vehicleRepo
    },
    estimateWalkTime: {
      vehicleRepo: vehicleRepo,
      routingService: routingService
    },
    suggestBestVehicle: {
      vehicleRepo: vehicleRepo,
      routingService: routingService,
      zoneValidator: zoneValidator,
      pricingService: pricingService
    },
    applyPromotion: {
      promotionService: promotionService
    },
    openSupportTicket: {
      supportService: supportService
    },
    reportDamagedVehicle: {
      maintenanceService: maintenanceService,
      notificationSender: notificationSender
    },
    vehicleBatteryStatus: {
      vehicleRepo: vehicleRepo
    },
    unlockVehicle: {
      unlockService: unlockService,
      bookingRepo: bookingRepo,
      rideRepo: rideRepo,
      vehicleRepo: vehicleRepo
    },
    unlockMethod: {
      unlockService: unlockService,
      vehicleRepo: vehicleRepo
    },
    managePaymentMethod: {
      userRepo: userRepo,
      billingService: billingService
    },
    pauseRide: {
      rideRepo: rideRepo,
      vehicleRepo: vehicleRepo
    },
    usageFrequencyReport: {
      reportingService: reportingService
    },
    mobilityPeriodicReport: {
      reportingService: reportingService
    },
    markUrbanWarningZone: {
      zoneRepo: zoneRepo,
      notificationSender: notificationSender
    },
    highDensityZoneMap: {
      reportingService: reportingService
    },
    defineSensitiveZone: {
      zoneRepo: zoneRepo,
      zoneValidator: zoneValidator
    },
    fleetDistributionMap: {
      vehicleRepo: vehicleRepo,
      gpsTrackingService: gpsTrackingService,
      fleetZoneRepo: fleetZoneRepo
    },
    lowAvailabilityAlert: {
      fleetZoneRepo: fleetZoneRepo,
      notificationSender: notificationSender
    },
    receiveMalfunctionReport: {
      maintenanceService: maintenanceService
    },
    verifyParkingPosition: {
      zoneValidator: zoneValidator,
      gpsTrackingService: gpsTrackingService,
      vehicleRepo: vehicleRepo
    },
    maintenanceQueue: {
      maintenanceService: maintenanceService
    },
    vehicleGPSHistory: {
      gpsTrackingService: gpsTrackingService
    },
    manageSupportTickets: {
      supportService: supportService,
      userRepo: userRepo
    },
    configureParkingBonus: {
      incentiveService: incentiveService
    },
    suspendUserAccount: {
      authService: authService,
      userRepo: userRepo
    },
    remoteLockVehicle: {
      unlockService: unlockService,
      vehicleRepo: vehicleRepo,
      zoneValidator: zoneValidator,
      notificationSender: notificationSender
    },
    expiredBookingsMonitor: {
      bookingRepo: bookingRepo
    }
  }
}

export const container = buildContainer()
