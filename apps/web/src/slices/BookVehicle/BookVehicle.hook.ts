import { useState } from 'react'
import type { BookVehicleViewState } from './BookVehicle.types'

export function useBookVehicle(): BookVehicleViewState {
  const [status] = useState<BookVehicleViewState['status']>('idle')
  return { status }
}
