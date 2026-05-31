import type { IUnlockService, IVehicleRepository, IZoneValidator, INotificationSender } from '@vsa/contracts'
import type { RemoteLockVehicleRequest, RemoteLockVehicleResponse } from './RemoteLockVehicle.types'

export function makeRemoteLockVehicleHandler(deps: {
  unlockService: IUnlockService
  vehicleRepo: IVehicleRepository
  zoneValidator: IZoneValidator
  notificationSender: INotificationSender
}) {
  return async function remoteLockVehicleHandler(
    req: RemoteLockVehicleRequest
  ): Promise<RemoteLockVehicleResponse> {
    return {} as RemoteLockVehicleResponse
  }
}
