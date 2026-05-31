import type { IZoneRepository, INotificationSender } from '@vsa/contracts'
import type { MarkUrbanWarningZoneRequest, MarkUrbanWarningZoneResponse } from './MarkUrbanWarningZone.types'

export function makeMarkUrbanWarningZoneHandler(deps: {
  zoneRepo: IZoneRepository
  notificationSender: INotificationSender
}) {
  return async function markUrbanWarningZoneHandler(
    req: MarkUrbanWarningZoneRequest
  ): Promise<MarkUrbanWarningZoneResponse> {
    return {} as MarkUrbanWarningZoneResponse
  }
}
