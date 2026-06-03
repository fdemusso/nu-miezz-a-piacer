import type { IRideRepository, IVehicleRepository } from '@vsa/contracts'
import type { PauseRideRequest, PauseRideResponse } from './PauseRide.types'

export function makePauseRideHandler(deps: {
  rideRepo: IRideRepository
  vehicleRepo: IVehicleRepository
}) {
  return async function pauseRideHandler(
    req: PauseRideRequest
  ): Promise<PauseRideResponse> {
    const { userId } = req

    const ride = await deps.rideRepo.findActiveByUser(userId)
    if (!ride) throw Object.assign(new Error('Active ride not found'), { status: 404 })

    ride.paused = !ride.paused
    await deps.rideRepo.save(ride)

    return { rideId: ride.id, paused: ride.paused }
  }
}
