import {
  InMemoryUserRepository, InMemoryVehicleRepository,
  InMemoryBookingRepository, InMemoryRideRepository,
  InMemoryZoneRepository, InMemoryFleetZoneRepository,
} from '../adapters/repositories'
import {
  JwtAuthService, GeoZoneValidator, HaversineRoutingService,
  StandardPricingService, MockBillingProcessor, StandardPromotionService,
  StandardIncentiveService, FirebasePushSender, MockUnlockService,
  GpsTrackingService, StandardMaintenanceService, StandardSupportService,
  StandardReportingService,
} from '../adapters/services'
import type { Container } from '../composition/types'

export function buildTestContainer(): Container {
  const userRepo = new InMemoryUserRepository()
  const vehicleRepo = new InMemoryVehicleRepository()
  const bookingRepo = new InMemoryBookingRepository()
  const rideRepo = new InMemoryRideRepository()
  const zoneRepo = new InMemoryZoneRepository()
  const fleetZoneRepo = new InMemoryFleetZoneRepository()

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
    nearbyVehicles: { vehicleRepo, gpsTrackingService, fleetZoneRepo },
    bookVehicle: { userRepo, vehicleRepo, bookingRepo },
    estimateRideCost: { vehicleRepo, pricingService, promotionService },
    endRide: { rideRepo, vehicleRepo, zoneValidator, billingService, incentiveService, notificationSender },
    rideSummary: { rideRepo, vehicleRepo },
    vehicleDetails: { vehicleRepo },
    estimateWalkTime: { vehicleRepo, routingService },
    suggestBestVehicle: { vehicleRepo, routingService, zoneValidator, pricingService },
    applyPromotion: { promotionService },
    openSupportTicket: { supportService },
    reportDamagedVehicle: { maintenanceService, notificationSender },
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
    fleetDistributionMap: { vehicleRepo, gpsTrackingService, fleetZoneRepo },
    lowAvailabilityAlert: { fleetZoneRepo, notificationSender },
    receiveMalfunctionReport: { maintenanceService },
    verifyParkingPosition: { zoneValidator, gpsTrackingService, vehicleRepo },
    maintenanceQueue: { maintenanceService },
    vehicleGPSHistory: { gpsTrackingService },
    manageSupportTickets: { supportService, userRepo },
    configureParkingBonus: { incentiveService },
    suspendUserAccount: { authService, userRepo },
    remoteLockVehicle: { unlockService, vehicleRepo, zoneValidator, notificationSender },
    expiredBookingsMonitor: { bookingRepo },
  }
}
