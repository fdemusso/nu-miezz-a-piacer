import type { NearbyVehicle } from '../NearbyVehicles/NearbyVehicles.types'

export interface BookVehicleViewState {
  loading: boolean
  error: string | null
  vehicle: NearbyVehicle | null
  timeRemaining: number
  formattedTime: string
  isExpired: boolean
  cancelBooking: () => void
  unlockVehicle: () => void
}
