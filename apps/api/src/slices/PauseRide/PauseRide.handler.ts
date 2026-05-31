import type { IRideRepository, IVehicleRepository } from '@vsa/contracts'
import type { PauseRideRequest, PauseRideResponse } from './PauseRide.types'

export function makePauseRideHandler(deps: {
  rideRepo: IRideRepository
  vehicleRepo: IVehicleRepository
}) {
  return async function pauseRideHandler(
    req: PauseRideRequest
  ): Promise<PauseRideResponse> {
    return {} as PauseRideResponse
  }
}
