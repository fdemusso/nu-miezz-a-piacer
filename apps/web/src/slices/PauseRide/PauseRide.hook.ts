import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { NearbyVehicle } from '../NearbyVehicles/NearbyVehicles.types'
import type { PauseRideViewState } from './PauseRide.types'

const DEFAULT_VEHICLE: NearbyVehicle = {
  id: 'v-001',
  type: 'scooter',
  label: 'E-Scooter #A3',
  position: { lat: 40.8518, lng: 14.2681 },
  status: 'available',
  batteryLevel: 85,
  distanceMeters: 120,
  pricingPlan: { unlockCost: 1.0, perMinuteCost: 0.25 },
}

// ── Tariffe Pause dedicate per tipologia di veicolo ──────────────────────────
const RATES: Record<string, { activeMin: number; pausedMin: number; unlock: number }> = {
  scooter: { activeMin: 0.25, pausedMin: 0.10, unlock: 1.00 },
  bike:    { activeMin: 0.10, pausedMin: 0.04, unlock: 0.50 },
  ebike:   { activeMin: 0.18, pausedMin: 0.08, unlock: 0.80 },
  car:     { activeMin: 0.35, pausedMin: 0.15, unlock: 2.00 },
}

export function usePauseRide(): PauseRideViewState {
  const navigate = useNavigate()
  const location = useLocation()

  // Retrieve active vehicle from route state, fallback to mock if none
  const vehicle = (location.state?.vehicle as NearbyVehicle) || DEFAULT_VEHICLE
  
  const pricing = useMemo(() => {
    return RATES[vehicle.type] || RATES.scooter
  }, [vehicle.type])

  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState(pricing.unlock)
  const [isEndingRide, setIsEndingRide] = useState(false)

  // Running Timer and Live Cost Accumulation
  useEffect(() => {
    if (isEndingRide) return

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
      
      // Calculate charge for this 1-second step
      const ratePerMinute = isPaused ? pricing.pausedMin : pricing.activeMin
      const chargePerSecond = ratePerMinute / 60
      setEstimatedCost((prev) => prev + chargePerSecond)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, isEndingRide, pricing])

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(elapsedSeconds / 60)
    const seconds = elapsedSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [elapsedSeconds])

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  const endRide = useCallback(() => {
    setIsEndingRide(true)
    
    // Simulate GPS and Parking Validation before completing
    setTimeout(() => {
      navigate('/fine-corsa', {
        state: {
          vehicle,
          elapsedSeconds,
          formattedTime,
          estimatedCost,
        },
      })
    }, 1500)
  }, [navigate, vehicle, elapsedSeconds, formattedTime, estimatedCost])

  return {
    loading,
    error,
    vehicle,
    elapsedSeconds,
    formattedTime,
    estimatedCost,
    isPaused,
    togglePause,
    isEndingRide,
    endRide,
  }
}
