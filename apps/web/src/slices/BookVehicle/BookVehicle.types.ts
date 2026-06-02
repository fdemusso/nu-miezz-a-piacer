import type { PricingPlan } from '@vsa/contracts'

export interface BookedVehicle {
  id: string
  type: 'scooter' | 'bike' | 'ebike' | 'car'
  batteryLevel: number
  pricingPlan: PricingPlan
  label: string
  distanceMeters: number
}

export interface BookVehicleViewState {
  loading: boolean
  error: string | null
  vehicle: BookedVehicle | null
  timeRemaining: number
  formattedTime: string
  isExpired: boolean
  cancelBooking: () => void
  unlockVehicle: () => void
}
