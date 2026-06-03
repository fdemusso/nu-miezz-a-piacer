import type { IRideRepository, IVehicleRepository } from '@vsa/contracts'
import type { RideSummaryRequest, RideSummaryResponse } from './RideSummary.types'

export function makeRideSummaryHandler(deps: {
  rideRepo: IRideRepository
  vehicleRepo: IVehicleRepository
}) {
  return async function rideSummaryHandler(
    req: RideSummaryRequest
  ): Promise<RideSummaryResponse> {
    const { rideId } = req

    const ride = await deps.rideRepo.findById(rideId)
    if (!ride) throw Object.assign(new Error('Ride not found'), { status: 404 })

    const vehicle = await deps.vehicleRepo.findById(ride.vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })

    const durationSeconds = ride.endedAt
      ? (ride.endedAt.getTime() - ride.startedAt.getTime()) / 1000
      : null

    return {
      ride,
      vehicleType: vehicle.type,
      vehiclePlate: vehicle.licensePlate,
      durationSeconds,
    }
  }
}
