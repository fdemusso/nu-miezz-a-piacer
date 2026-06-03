import type { CostEstimate, Coordinates, VehicleType } from '@vsa/contracts'

export interface SuggestBestVehicleRequest {
  fromLat: number
  fromLng: number
  toLat: number
  toLng: number
}

export interface VehicleSuggestion {
  vehicleId: string
  type: VehicleType
  position: Coordinates
  walkSeconds: number
  routeSeconds: number
  estimatedCost: CostEstimate
}

export interface SuggestBestVehicleResponse {
  suggestions: VehicleSuggestion[]
}
