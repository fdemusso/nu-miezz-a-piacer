import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { BookedVehicle } from './BookVehicle.types'
import type { BookVehicleViewState } from './BookVehicle.types'

const DEFAULT_VEHICLE: BookedVehicle = {
  id: 'v-001',
  type: 'scooter',
  label: 'E-Scooter #A3',
  batteryLevel: 85,
  distanceMeters: 120,
  pricingPlan: { unlockCost: 1.0, perMinuteCost: 0.25 },
}

export function useBookVehicle(): BookVehicleViewState {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Extract vehicle from navigation state, fallback to a sensible mock if accessed directly
  const vehicle = (location.state?.vehicle as BookedVehicle) || DEFAULT_VEHICLE

  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  
  // Countdown starting from 15:00 (900 seconds)
  const [timeRemaining, setTimeRemaining] = useState(900)

  useEffect(() => {
    if (timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  const formattedTime = (() => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })()

  const isExpired = timeRemaining === 0

  const cancelBooking = useCallback(() => {
    // Navigate back to the home map screen
    navigate('/')
  }, [navigate])

  const unlockVehicle = useCallback(() => {
    navigate('/corsa', { state: { vehicle } })
  }, [navigate, vehicle])

  return {
    loading,
    error,
    vehicle,
    timeRemaining,
    formattedTime,
    isExpired,
    cancelBooking,
    unlockVehicle,
  }
}
