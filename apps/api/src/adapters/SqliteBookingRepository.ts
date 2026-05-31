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

export class SqliteBookingRepository implements IBookingRepository {
  async findById(bookingId: string): Promise<Booking | null> { return null }

  async findActiveByUser(userId: string): Promise<Booking | null> { return null }

  async findExpiredNotStarted(): Promise<Booking[]> { return [] }

  async save(booking: Booking): Promise<void> { }

  async update(booking: Booking): Promise<void> { }
}
