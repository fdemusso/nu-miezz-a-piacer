import type {
  User, Vehicle, Booking, Ride, ZoneRule, ZoneType, FleetZone, Coordinates,
  VehicleConditionReport, SupportTicket, ParkingBonusRule, GeoPoint,
  VehiclePositionSnapshot, VehicleStatus, Customer, Promotion, PaymentMethod,
  WalkEstimate, RouteEstimate, CostEstimate, ParkingValidationResult, Money,
  MobilityReport, TimeRange, VehicleType, UnlockMethodType, UserRole,
  IUserRepository, IVehicleRepository, IBookingRepository, IRideRepository,
  IZoneRepository, IFleetZoneRepository, IAuthService, IZoneValidator,
  IRoutingService, IPricingService, IBillingService, IPromotionService,
  IIncentiveService, INotificationSender, IUnlockService, IGpsTrackingService,
  IMaintenanceService, ISupportService, IReportingService,
} from '@vsa/contracts'

export class SqliteFleetZoneRepository implements IFleetZoneRepository {
  async findAll(): Promise<FleetZone[]> { return [] }

  async findById(zoneId: string): Promise<FleetZone | null> { return null }

  async findBelowThreshold(): Promise<FleetZone[]> { return [] }

  async updateAvailability(zoneId: string, currentAvailableVehicles: number): Promise<void> { }
}
