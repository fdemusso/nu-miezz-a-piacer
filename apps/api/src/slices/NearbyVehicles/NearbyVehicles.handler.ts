import type { IVehicleRepository } from '@vsa/contracts'
import type { NearbyVehiclesRequest, NearbyVehiclesResponse } from './NearbyVehicles.types'

export function makeNearbyVehiclesHandler(deps: { vehicleRepo: IVehicleRepository }) {
  return async function nearbyVehiclesHandler(
    req: NearbyVehiclesRequest
  ): Promise<NearbyVehiclesResponse> {
    const lat = parseFloat(req.lat)
    const lng = parseFloat(req.lng)
    const radiusMeters = req.radiusMeters ? parseFloat(req.radiusMeters) : 500

    const all = await deps.vehicleRepo.findNearby({ lat, lng }, radiusMeters)
    const vehicles = all
      .filter(v => v.status === 'available' && v.batteryLevel > 10)
      .map(v => ({ id: v.id, type: v.type, position: v.position, batteryLevel: v.batteryLevel }))

    return { vehicles }
  }
}
