import type { GeoPoint, ZoneRule } from '@vsa/contracts'

export interface MarkUrbanWarningZoneRequest {
  name: string
  type: 'sensitive' | 'forbidden'
  boundary: GeoPoint[]
}

export interface MarkUrbanWarningZoneResponse {
  zone: ZoneRule
}
