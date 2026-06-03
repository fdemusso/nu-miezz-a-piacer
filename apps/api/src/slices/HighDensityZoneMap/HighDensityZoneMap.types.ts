import type { FleetZone } from '@vsa/contracts'

export interface HighDensityZoneMapRequest {}

export interface HighDensityZoneMapResponse {
  zones: FleetZone[]
}
