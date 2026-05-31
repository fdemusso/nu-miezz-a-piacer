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

export class SqliteUserRepository implements IUserRepository {
  async findById(userId: string): Promise<User | null> { return null }

  async findByEmail(email: string): Promise<User | null> { return null }

  async save(user: User): Promise<void> { }

  async update(user: User): Promise<void> { }
}
