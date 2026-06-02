export interface ActiveRideVehicle {
  id: string
  type: 'scooter' | 'bike' | 'ebike' | 'car'
  label: string
  batteryLevel: number
}

export interface PauseRideViewState {
  loading: boolean
  error: string | null
  vehicle: ActiveRideVehicle | null
  elapsedSeconds: number
  formattedTime: string
  estimatedCost: number
  isPaused: boolean
  togglePause: () => void
  isEndingRide: boolean
  endRide: () => void
}
