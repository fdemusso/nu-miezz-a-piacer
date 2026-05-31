import type { IVehicleRepository, IGpsTrackingService, IFleetZoneRepository } from '@vsa/contracts'
import type { NearbyVehiclesRequest, NearbyVehiclesResponse } from './NearbyVehicles.types'

export function makeNearbyVehiclesHandler(deps: {
  vehicleRepo: IVehicleRepository
  gpsTrackingService: IGpsTrackingService
  fleetZoneRepo: IFleetZoneRepository
}) {
  return async function nearbyVehiclesHandler(
    req: NearbyVehiclesRequest
  ): Promise<NearbyVehiclesResponse> {
    return {} as NearbyVehiclesResponse
  }
}
