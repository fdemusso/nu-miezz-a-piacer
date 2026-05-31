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

export class StandardReportingService implements IReportingService {
  async generateMobilityReport(period: TimeRange): Promise<MobilityReport> { return {} as MobilityReport }

  async getUsageByVehicleType(period: TimeRange): Promise<Record<VehicleType, number>> { return {} as Record<VehicleType, number> }

  async getHighDensityZones(period: TimeRange): Promise<Coordinates[]> { return [] }
}
