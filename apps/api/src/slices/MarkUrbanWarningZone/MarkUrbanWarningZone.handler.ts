import type { IZoneRepository, INotificationSender } from '@vsa/contracts'
import type { MarkUrbanWarningZoneRequest, MarkUrbanWarningZoneResponse } from './MarkUrbanWarningZone.types'

export function makeMarkUrbanWarningZoneHandler(deps: {
  zoneRepo: IZoneRepository
  notificationSender: INotificationSender
}) {
  return async function markUrbanWarningZoneHandler(
    req: MarkUrbanWarningZoneRequest
  ): Promise<MarkUrbanWarningZoneResponse> {
    const zone = {
      id: crypto.randomUUID(),
      type: req.type,
      name: req.name,
      boundary: req.boundary,
    }

    await deps.zoneRepo.save(zone)

    await deps.notificationSender.broadcast(
      ['u-operator-1', 'u-customer-1'],
      'Nuova zona urbana',
      `${req.name} (${req.type})`
    )

    return { zone }
  }
}
