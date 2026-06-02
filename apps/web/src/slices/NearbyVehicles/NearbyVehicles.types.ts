export type { VehicleType, Coordinates, PricingPlan } from '@vsa/contracts'

// ── Nearby Vehicle ────────────────────────────────────────────────────────────

/** Veicolo disponibile nelle vicinanze dell'utente */
export interface NearbyVehicle {
  id: string
  type: import('@vsa/contracts').VehicleType
  position: import('@vsa/contracts').Coordinates
  status: 'available'
  /** Percentuale di batteria 0-100 */
  batteryLevel: number
  pricingPlan: PricingPlan
  /** Etichetta leggibile, es. "E-Scooter #A3" */
  label: string
  /** Distanza dall'utente in metri (calcolata lato client/mock) */
  distanceMeters: number
}

// ── View-State ────────────────────────────────────────────────────────────────

export type VehicleTypeFilter = import('@vsa/contracts').VehicleType | 'all'

export interface NearbyVehiclesViewState {
  loading: boolean
  error: string | null
  /** Lista filtrata di veicoli vicini */
  vehicles: NearbyVehicle[]
  /** Veicolo attualmente selezionato */
  selectedVehicle: NearbyVehicle | null
  /** Filtro attivo per tipologia */
  activeFilter: VehicleTypeFilter
  /** Callback per selezionare un veicolo */
  selectVehicle: (vehicle: NearbyVehicle | null) => void
  /** Callback per impostare il filtro tipologia */
  setFilter: (filter: VehicleTypeFilter) => void
  /** Stato dello scanner QR */
  isScanning: boolean
  /** Callback per avviare la scansione */
  startScanning: () => void
  /** Callback per fermare la scansione */
  stopScanning: () => void
}
