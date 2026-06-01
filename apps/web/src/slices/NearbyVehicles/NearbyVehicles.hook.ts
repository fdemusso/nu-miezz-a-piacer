import { useState, useMemo, useCallback } from 'react'
import type {
  NearbyVehicle,
  NearbyVehiclesViewState,
  VehicleTypeFilter,
} from './NearbyVehicles.types'

// ── Posizione GPS simulata dell'utente sulla mappa di Mappa0.json ────────────
// In questo sistema Cartesiano: lng = coordinata X, lat = coordinata Y
const USER_POSITION = { lat: -10, lng: 50 } // Posizionato vicino all'origine, direttamente su una strada principale

// ── Dati mock — veicoli posizionati esattamente sulle giunzioni delle strade di Mappa0.json ───────────
const MOCK_VEHICLES: NearbyVehicle[] = [
  {
    id: 'v-001',
    type: 'scooter',
    label: 'E-Scooter #A3',
    position: { lat: -97, lng: -60 },           // Strada 2 (Junction)
    status: 'available',
    batteryLevel: 85,
    distanceMeters: 0,                           // Calcolato geometricamente
    pricingPlan: { unlockCost: 1.0, perMinuteCost: 0.25 },
  },
  {
    id: 'v-002',
    type: 'bike',
    label: 'City Bike #B7',
    position: { lat: 6, lng: 32 },              // Strada 1 (Junction - Molto vicina!)
    status: 'available',
    batteryLevel: 100,                           // Bici meccanica
    distanceMeters: 0,
    pricingPlan: { unlockCost: 0.5, perMinuteCost: 0.10 },
  },
  {
    id: 'v-003',
    type: 'car',
    label: 'Smart EQ #C1',
    position: { lat: -61, lng: 185 },           // Strada 1 (Junction)
    status: 'available',
    batteryLevel: 45,
    distanceMeters: 0,
    pricingPlan: { unlockCost: 2.0, perMinuteCost: 0.35 },
  },
  {
    id: 'v-004',
    type: 'scooter',
    label: 'E-Scooter #A9',
    position: { lat: -174, lng: -158 },         // Strada 2 (Junction)
    status: 'available',
    batteryLevel: 91,
    distanceMeters: 0,
    pricingPlan: { unlockCost: 1.0, perMinuteCost: 0.25 },
  },
  {
    id: 'v-005',
    type: 'ebike',
    label: 'E-Bike #D2',
    position: { lat: 9, lng: -85 },             // Strada 3 (Junction)
    status: 'available',
    batteryLevel: 62,
    distanceMeters: 0,
    pricingPlan: { unlockCost: 0.8, perMinuteCost: 0.18 },
  },
]

// ── Calcolo distanza Euclidea 2D (in metri di coordinate Cartesiane) ─────────
function calculateDistanceMeters(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }) {
  const dx = p2.lng - p1.lng
  const dy = p2.lat - p1.lat
  return Math.round(Math.sqrt(dx * dx + dy * dy))
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
