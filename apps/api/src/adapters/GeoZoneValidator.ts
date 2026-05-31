import type {
  Coordinates, FleetZone, ZoneRule, ParkingValidationResult, IZoneValidator,
} from '@vsa/contracts'

export class GeoZoneValidator implements IZoneValidator {
  isInsideZone(position: Coordinates, zone: ZoneRule | FleetZone): boolean {
    const poly = 'boundary' in zone ? zone.boundary : []
    if (poly.length < 3) return false
    let inside = false
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].lng, yi = poly[i].lat
      const xj = poly[j].lng, yj = poly[j].lat
      const intersect =
        yi > position.lat !== yj > position.lat &&
        position.lng < ((xj - xi) * (position.lat - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }
    return inside
  }

  validate(position: Coordinates, zones: ZoneRule[]): ParkingValidationResult {
    for (const z of zones) {
      if (z.type === 'forbidden' && this.isInsideZone(position, z)) {
        return { valid: false, reason: `forbidden zone: ${z.name}` }
      }
    }
    const parkingZones = zones.filter(z => z.type === 'parking')
    if (parkingZones.length > 0 && !parkingZones.some(z => this.isInsideZone(position, z))) {
      return { valid: false, reason: 'outside parking zone' }
    }
    return { valid: true }
  }
}
