import type { GeoPoint, ZoneRule } from '@vsa/contracts'

export interface DefineSensitiveZoneRequest {
  name: string
  boundary: GeoPoint[]
}

export interface DefineSensitiveZoneResponse {
  zone: ZoneRule
}
