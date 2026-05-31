import { useState } from 'react'
import type { BookVehicleViewState } from './BookVehicle.types'

export function useBookVehicle(): BookVehicleViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
