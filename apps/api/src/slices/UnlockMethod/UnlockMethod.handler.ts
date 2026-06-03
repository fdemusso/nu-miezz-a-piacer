import type { IUnlockService, IVehicleRepository } from '@vsa/contracts'
import type { UnlockMethodRequest, UnlockMethodResponse } from './UnlockMethod.types'

export function makeUnlockMethodHandler(deps: {
  unlockService: IUnlockService
  vehicleRepo: IVehicleRepository
}) {
  return async function unlockMethodHandler(
    req: UnlockMethodRequest
  ): Promise<UnlockMethodResponse> {
    const { vehicleId } = req

    const vehicle = await deps.vehicleRepo.findById(vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })

    const methods = await deps.unlockService.getAvailableMethods(vehicle)

    return { methods }
  }
}
