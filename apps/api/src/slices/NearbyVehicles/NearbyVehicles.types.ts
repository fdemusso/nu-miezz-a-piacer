import type { VehicleType, Coordinates } from '@vsa/contracts'

export interface NearbyVehiclesRequest {
  lat: string
  lng: string
  radiusMeters?: string
}

export interface NearbyVehicleItem {
  id: string
  type: VehicleType
  position: Coordinates
  batteryLevel: number
}

export interface NearbyVehiclesResponse {
  vehicles: NearbyVehicleItem[]
}
