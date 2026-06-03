import type { IVehicleRepository, IRoutingService, IZoneValidator, IPricingService, IZoneRepository } from '@vsa/contracts'
import type { SuggestBestVehicleRequest, SuggestBestVehicleResponse, VehicleSuggestion } from './SuggestBestVehicle.types'

export function makeSuggestBestVehicleHandler(deps: {
  vehicleRepo: IVehicleRepository
  routingService: IRoutingService
  zoneValidator: IZoneValidator
  pricingService: IPricingService
  zoneRepo: IZoneRepository
}) {
  return async function suggestBestVehicleHandler(
    req: SuggestBestVehicleRequest
  ): Promise<SuggestBestVehicleResponse> {
    const from = { lat: req.fromLat, lng: req.fromLng }
    const to = { lat: req.toLat, lng: req.toLng }

    const nearby = await deps.vehicleRepo.findNearby(from, 500)
    const available = nearby.filter(v => v.status === 'available')

    const zones = await deps.zoneRepo.findAll()

    const isForbiddenDestination = zones.some(
      z => z.type === 'forbidden' && deps.zoneValidator.isInsideZone(to, z)
    )

    const results = await Promise.all(
      available.map(async v => {
        const walk = await deps.routingService.estimateWalk(from, v.position)
        const route = await deps.routingService.estimateRoute(v.position, to)
        const cost = await deps.pricingService.estimateCost(v, route.durationSeconds)
        return { v, walk, route, cost }
      })
    )

    const suggestions: VehicleSuggestion[] = results
      .filter(() => !isForbiddenDestination)
      .map(({ v, walk, route, cost }) => ({
        vehicleId: v.id,
        type: v.type,
        position: v.position,
        walkSeconds: walk.durationSeconds,
        routeSeconds: route.durationSeconds,
        estimatedCost: cost,
      }))
      .sort((a, b) => (a.walkSeconds + a.routeSeconds) - (b.walkSeconds + b.routeSeconds))

    return { suggestions }
  }
}
