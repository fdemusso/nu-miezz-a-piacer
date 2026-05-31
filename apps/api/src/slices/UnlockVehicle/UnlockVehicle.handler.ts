import type { IUnlockService, IBookingRepository, IRideRepository, IVehicleRepository } from '@vsa/contracts'
import type { UnlockVehicleRequest, UnlockVehicleResponse } from './UnlockVehicle.types'

export function makeUnlockVehicleHandler(deps: {
  unlockService: IUnlockService
  bookingRepo: IBookingRepository
  rideRepo: IRideRepository
  vehicleRepo: IVehicleRepository
}) {
  return async function unlockVehicleHandler(
    req: UnlockVehicleRequest
  ): Promise<UnlockVehicleResponse> {
    return {} as UnlockVehicleResponse
  }
}
