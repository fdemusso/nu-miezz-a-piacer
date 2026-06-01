import type { NearbyVehicle } from '../NearbyVehicles/NearbyVehicles.types'

export interface PauseRideViewState {
  loading: boolean
  error: string | null
  vehicle: NearbyVehicle | null
  elapsedSeconds: number
  formattedTime: string
  estimatedCost: number
  isPaused: boolean
  togglePause: () => void
  isEndingRide: boolean
  endRide: () => void
}
