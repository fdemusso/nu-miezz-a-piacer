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

export class GeoZoneValidator implements IZoneValidator {
  async validateDestination(vehicle: Vehicle, destination: Coordinates): Promise<boolean> { return false }

  async validateParking(vehicle: Vehicle, position: Coordinates): Promise<ParkingValidationResult> { return {} as ParkingValidationResult }

  async getActiveRulesByPosition(position: Coordinates): Promise<ZoneRule[]> { return [] }
}
