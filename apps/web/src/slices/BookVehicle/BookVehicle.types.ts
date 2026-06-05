import type { Booking } from '@vsa/contracts'

export interface BookVehicleViewState {
  status: 'idle' | 'loading' | 'booked' | 'cancelling' | 'error'
  booking: Booking | null
  formattedTime: string
  secondsLeft: number
  isExpired: boolean
  cancel: () => Promise<void>
  navigate: () => void
  clearTimer: () => void
}

