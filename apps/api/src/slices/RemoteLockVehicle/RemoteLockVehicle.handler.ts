import type { IUnlockService, IVehicleRepository, INotificationSender } from '@vsa/contracts'
import type { RemoteLockVehicleRequest, RemoteLockVehicleResponse } from './RemoteLockVehicle.types'

export function makeRemoteLockVehicleHandler(deps: {
  unlockService: IUnlockService
  vehicleRepo: IVehicleRepository
  notificationSender: INotificationSender
}) {
  return async function remoteLockVehicleHandler(
    req: RemoteLockVehicleRequest
  ): Promise<RemoteLockVehicleResponse> {
    const { vehicleId, reason } = req

    const vehicle = await deps.vehicleRepo.findById(vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })

    await deps.unlockService.lock(vehicleId)

    vehicle.status = 'maintenance'
    await deps.vehicleRepo.save(vehicle)

    await deps.notificationSender.send(
      'u-operator-1',
      'Veicolo bloccato',
      `${vehicleId}: ${reason ?? 'ispezione'}`
    )

    return { vehicleId, locked: true }
  }
}
