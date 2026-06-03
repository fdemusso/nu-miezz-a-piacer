import type { IFleetZoneRepository, INotificationSender } from '@vsa/contracts'
import type { LowAvailabilityAlertRequest, LowAvailabilityAlertResponse } from './LowAvailabilityAlert.types'

export function makeLowAvailabilityAlertHandler(deps: {
  fleetZoneRepo: IFleetZoneRepository
  notificationSender: INotificationSender
}) {
  return async function lowAvailabilityAlertHandler(
    _req: LowAvailabilityAlertRequest
  ): Promise<LowAvailabilityAlertResponse> {
    const zones = await deps.fleetZoneRepo.findAll()
    const critical = zones.filter(z => z.vehicleCount < z.targetCount * 0.3)

    await Promise.all(
      critical.map(z =>
        deps.notificationSender.broadcast(
          ['u-operator-1'],
          'Disponibilità critica',
          `Zona ${z.name}: ${z.vehicleCount}/${z.targetCount} veicoli`
        )
      )
    )

    return {
      alertsSent: critical.length,
      zones: critical.map(z => ({
        id: z.id,
        name: z.name,
        vehicleCount: z.vehicleCount,
        targetCount: z.targetCount,
      })),
    }
  }
}
