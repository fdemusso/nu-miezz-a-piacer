import type { IUnlockService, IVehicleRepository } from '@vsa/contracts'
import type { UnlockMethodRequest, UnlockMethodResponse } from './UnlockMethod.types'

export function makeUnlockMethodHandler(deps: {
  unlockService: IUnlockService
  vehicleRepo: IVehicleRepository
}) {
  return async function unlockMethodHandler(
    req: UnlockMethodRequest
  ): Promise<UnlockMethodResponse> {
    return {} as UnlockMethodResponse
  }
}
