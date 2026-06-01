import { useState, useMemo, useCallback } from 'react'
import type {
  NearbyVehicle,
  NearbyVehiclesViewState,
  VehicleTypeFilter,
} from './NearbyVehicles.types'

// ── Centro di Napoli — Coordinate GPS simulate dell'utente ───────────────────
const USER_POSITION = { lat: 40.8465, lng: 14.2530 } // Napoli Centro (Via Toledo/Piazza Municipio)

// ── Dati mock — veicoli sparsi nel centro di Napoli ───────────────────────────
const MOCK_VEHICLES: NearbyVehicle[] = [
  {
    id: 'v-001',
    type: 'scooter',
    label: 'E-Scooter #A3',
    position: { lat: 40.8518, lng: 14.2681 },   // Piazza Garibaldi
    status: 'available',
    batteryLevel: 85,
    distanceMeters: 0,                           // Calcolato geometricamente
    pricingPlan: { unlockCost: 1.0, perMinuteCost: 0.25 },
  },
  {
    id: 'v-002',
    type: 'bike',
    label: 'City Bike #B7',
    position: { lat: 40.8478, lng: 14.2530 },   // Via Toledo (Molto vicino!)
    status: 'available',
    batteryLevel: 100,                           // bici meccanica → 100%
    distanceMeters: 0,
    pricingPlan: { unlockCost: 0.5, perMinuteCost: 0.10 },
  },
  {
    id: 'v-003',
    type: 'car',
    label: 'Smart EQ #C1',
    position: { lat: 40.8532, lng: 14.2726 },   // Stazione Centrale
    status: 'available',
    batteryLevel: 45,
    distanceMeters: 0,
    pricingPlan: { unlockCost: 2.0, perMinuteCost: 0.35 },
  },
  {
    id: 'v-004',
    type: 'scooter',
    label: 'E-Scooter #A9',
    position: { lat: 40.8360, lng: 14.2475 },   // Chiaia / Lungomare
    status: 'available',
    batteryLevel: 91,
    distanceMeters: 0,
    pricingPlan: { unlockCost: 1.0, perMinuteCost: 0.25 },
  },
  {
    id: 'v-005',
    type: 'ebike',
    label: 'E-Bike #D2',
    position: { lat: 40.8565, lng: 14.2345 },   // Vomero / Vanvitelli
    status: 'available',
    batteryLevel: 62,
    distanceMeters: 0,
    pricingPlan: { unlockCost: 0.8, perMinuteCost: 0.18 },
  },
]

// ── Calcolo distanza in metri (Haversine o Flat Approximation) ───────────────
function calculateDistanceMeters(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }) {
  const R = 6371e3 // Raggio terrestre in metri
  const phi1 = (p1.lat * Math.PI) / 180
  const phi2 = (p2.lat * Math.PI) / 180
  const deltaPhi = ((p2.lat - p1.lat) * Math.PI) / 180
  const deltaLambda = ((p2.lng - p1.lng) * Math.PI) / 180

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c)
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useNearbyVehicles(): NearbyVehiclesViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<VehicleTypeFilter>('all')
  const [selectedVehicle, setSelectedVehicle] = useState<NearbyVehicle | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  // Mappa delle distanze geometriche reali ordinate per vicinanza (mezzo più vicino in cima)
  const vehicles = useMemo(() => {
    const mapped = MOCK_VEHICLES.map((v) => ({
      ...v,
      distanceMeters: calculateDistanceMeters(USER_POSITION, v.position),
    }))

    const filtered = activeFilter === 'all'
      ? mapped
      : mapped.filter((v) => v.type === activeFilter)

    return filtered.sort((a, b) => a.distanceMeters - b.distanceMeters)
  }, [activeFilter])

  const selectVehicle = useCallback((vehicle: NearbyVehicle | null) => {
    setSelectedVehicle(vehicle)
  }, [])

  const setFilter = useCallback((filter: VehicleTypeFilter) => {
    setActiveFilter(filter)
    if (filter !== 'all' && selectedVehicle && selectedVehicle.type !== filter) {
      setSelectedVehicle(null)
    }
  }, [selectedVehicle])

  const startScanning = useCallback(() => {
    setIsScanning(true)
  }, [])

  const stopScanning = useCallback(() => {
    setIsScanning(false)
  }, [])

  return {
    loading,
    error,
    vehicles,
    selectedVehicle,
    activeFilter,
    selectVehicle,
    setFilter,
    isScanning,
    startScanning,
    stopScanning,
  }
}
