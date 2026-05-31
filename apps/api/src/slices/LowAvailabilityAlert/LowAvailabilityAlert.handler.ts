import type { IFleetZoneRepository, INotificationSender } from '@vsa/contracts'
import type { LowAvailabilityAlertRequest, LowAvailabilityAlertResponse } from './LowAvailabilityAlert.types'

export function makeLowAvailabilityAlertHandler(deps: {
  fleetZoneRepo: IFleetZoneRepository
  notificationSender: INotificationSender
}) {
  return async function lowAvailabilityAlertHandler(
    req: LowAvailabilityAlertRequest
  ): Promise<LowAvailabilityAlertResponse> {
    return {} as LowAvailabilityAlertResponse
  }
}
