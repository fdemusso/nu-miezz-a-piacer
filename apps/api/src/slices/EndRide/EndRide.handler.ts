import type { IRideRepository, IVehicleRepository, IZoneValidator, IBillingService, IIncentiveService, INotificationSender } from '@vsa/contracts'
import type { EndRideRequest, EndRideResponse } from './EndRide.types'

export function makeEndRideHandler(deps: {
  rideRepo: IRideRepository
  vehicleRepo: IVehicleRepository
  zoneValidator: IZoneValidator
  billingService: IBillingService
  incentiveService: IIncentiveService
  notificationSender: INotificationSender
}) {
  return async function endRideHandler(
    req: EndRideRequest
  ): Promise<EndRideResponse> {
    return {} as EndRideResponse
  }
}
