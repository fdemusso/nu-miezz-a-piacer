import type {
  Coordinates, WalkEstimate, RouteEstimate, IRoutingService,
} from '@vsa/contracts'

const EARTH_R = 6_371_000
const WALK_SPEED_MPS = 1.4   // ~5 km/h
const BIKE_SPEED_MPS = 5.0   // ~18 km/h

function haversine(a: Coordinates, b: Coordinates): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_R * Math.asin(Math.sqrt(h))
}

export class HaversineRoutingService implements IRoutingService {
  async estimateWalk(from: Coordinates, to: Coordinates): Promise<WalkEstimate> {
    const distanceMeters = haversine(from, to)
    return { distanceMeters, durationSeconds: distanceMeters / WALK_SPEED_MPS }
  }

  async estimateRoute(from: Coordinates, to: Coordinates): Promise<RouteEstimate> {
    const distanceMeters = haversine(from, to)
    return { distanceMeters, durationSeconds: distanceMeters / BIKE_SPEED_MPS }
  }
}
