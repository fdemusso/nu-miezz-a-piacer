import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useNearbyVehicles } from './NearbyVehicles.hook'
import type { NearbyVehicle, VehicleTypeFilter } from './NearbyVehicles.types'
import { useEstimateRideCost } from '../EstimateRideCost/EstimateRideCost.hook'

// ── Helpers ──────────────────────────────────────────────────────────────────

export const VEHICLE_ICONS: Record<string, (props: { className?: string; size?: number }) => React.ReactElement> = {
  scooter: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M18 8h-4" />
      <path d="M15 8l-4 11" />
      <path d="M5 19h12" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
    </svg>
  ),
  bike: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6h3.5" />
      <path d="M12 6l-3.5 11.5" />
      <path d="M5.5 17.5L12 6l3.5 7.5h-7" />
      <path d="M18.5 17.5L15 6" />
      <path d="M12 13.5l-3-4" />
    </svg>
  ),
  ebike: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6h3.5" />
      <path d="M12 6l-3.5 11.5" />
      <path d="M5.5 17.5L12 6l3.5 7.5h-7" />
      <path d="M18.5 17.5L15 6" />
      <path d="M11.5 11.5l-1.5 3h2.5l-1 3.5" />
    </svg>
  ),
  car: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
      <path d="M5 10h9" />
    </svg>
  ),
}

const QrCodeIcon = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </svg>
)

const FILTERS: { value: VehicleTypeFilter; label: string }[] = [
  { value: 'all', label: 'Tutti' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'bike', label: 'Bici' },
  { value: 'ebike', label: 'E-Bike' },
  { value: 'car', label: 'Auto' },
]

function batteryClass(level: number) {
  if (level >= 60) return 'high'
  if (level >= 25) return 'medium'
  return 'low'
}

function formatDistance(meters: number) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${meters} m`
}

/**
 * Map the vehicle position to % coordinates inside the map container.
 * We normalize positions relative to the bounding box of mock data.
 */
const LAT_RANGE = { min: 40.833, max: 40.860 }
const LNG_RANGE = { min: 14.230, max: 14.280 }

function toMapPercent(pos: { lat: number; lng: number }) {
  const x = ((pos.lng - LNG_RANGE.min) / (LNG_RANGE.max - LNG_RANGE.min)) * 100
  const y = ((LAT_RANGE.max - pos.lat) / (LAT_RANGE.max - LAT_RANGE.min)) * 100
  return {
    left: `${Math.max(8, Math.min(88, x))}%`,
    top: `${Math.max(10, Math.min(85, y))}%`,
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export function NearbyVehiclesPage() {
  const {
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
  } = useNearbyVehicles()

  React.useEffect(() => {
    if (!isScanning) return

    const timer = setTimeout(() => {
      // Seleziona automaticamente il veicolo più vicino
      if (vehicles.length > 0) {
        selectVehicle(vehicles[0])
      }
      stopScanning()
    }, 1500)

    return () => clearTimeout(timer)
  }, [isScanning, vehicles, selectVehicle, stopScanning])

  const [isCollapsed, setIsCollapsed] = React.useState(false)

  if (loading) return <div className="nv-page"><p style={{ padding: 24 }}>Caricamento…</p></div>
  if (error) return <div className="nv-page"><p style={{ padding: 24, color: '#f87171' }}>{error}</p></div>

  return (
    <div className="nv-page">
      {/* ── Simulated Map ── */}
      <div className="nv-map" aria-label="Mappa veicoli">
        {/* ── Filter Chips (inside map for correct stacking) ── */}
        <div className="nv-filter-bar" role="tablist" aria-label="Filtra per tipo di veicolo">
          {FILTERS.map(({ value, label }) => {
            const Icon = VEHICLE_ICONS[value]
            return (
              <button
                key={value}
                role="tab"
                aria-selected={activeFilter === value}
                className={`nv-chip${activeFilter === value ? ' active' : ''}`}
                onClick={() => {
                  setFilter(value)
                  setIsCollapsed(false)
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {Icon && <Icon size={14} />}
                {label}
              </button>
            )
          })}
        </div>

        <div className="nv-map-grid" />
        <div className="nv-map-roads" />

        {/* User position label */}
        <div className="nv-user-label">
          <span className="nv-user-dot" />
          La tua posizione
        </div>

        {/* User marker */}
        <div
          className="nv-user-marker"
          style={{ left: '46%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="nv-user-marker-dot" />
        </div>

        {/* Vehicle pins */}
        {vehicles.map((v) => {
          const pos = toMapPercent(v.position)
          const isSelected = selectedVehicle?.id === v.id
          const Icon = VEHICLE_ICONS[v.type]
          return (
            <button
              key={v.id}
              className={`nv-pin nv-pin--${v.type}${isSelected ? ' selected' : ''}`}
              style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
              onClick={() => {
                selectVehicle(isSelected ? null : v)
                setIsCollapsed(false)
              }}
              aria-label={`${v.label} — batteria ${v.batteryLevel}%`}
            >
              <span className="nv-pin-icon">
                {Icon && <Icon size={18} />}
              </span>
              <span className="nv-pin-label">{v.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Bottom Panel ── */}
      {selectedVehicle ? (
        <VehicleDetailPanel
          vehicle={selectedVehicle}
          onClose={() => {
            selectVehicle(null)
            setIsCollapsed(false)
          }}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onStartScanning={startScanning}
        />
      ) : (
        <VehicleListPanel
          vehicles={vehicles}
          onSelect={(v) => {
            selectVehicle(v)
            setIsCollapsed(false)
          }}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onStartScanning={startScanning}
        />
      )}

      {/* QR Scanner Fullscreen Overlay */}
      {isScanning && (
        <div className="nv-scanner-overlay" role="dialog" aria-modal="true" aria-label="Scansione QR Code">
          <button className="nv-scanner-close" onClick={stopScanning} aria-label="Chiudi scanner">✕</button>
          <div className="nv-scanner-container">
            <div className="nv-scanner-viewfinder">
              <div className="nv-scanner-corner top-left" />
              <div className="nv-scanner-corner top-right" />
              <div className="nv-scanner-corner bottom-left" />
              <div className="nv-scanner-corner bottom-right" />
              <div className="nv-scanner-laser" />
            </div>
            <p className="nv-scanner-text">Inquadra il QR Code sul veicolo</p>
            <div className="nv-scanner-hint">Scansione automatica in corso...</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function VehicleDetailPanel({
  vehicle,
  onClose,
  isCollapsed,
  onToggleCollapse,
  onStartScanning,
}: {
  vehicle: NearbyVehicle
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  onStartScanning: () => void
}) {
  const bClass = batteryClass(vehicle.batteryLevel)
  const navigate = useNavigate()
  const { getPricing } = useEstimateRideCost()
  const pricing = getPricing(vehicle.type)

  return (
    <section className={`nv-panel${isCollapsed ? ' collapsed' : ''}`} aria-label={`Dettagli ${vehicle.label}`}>
      {/* Floating QR scan button */}
      <button
        className="nv-qr-fab"
        onClick={onStartScanning}
        aria-label="Scansiona QR Code"
      >
        <QrCodeIcon size={22} />
      </button>

      <div className="nv-panel-handle" onClick={onToggleCollapse} />
      <button className="nv-close-btn" onClick={onClose} aria-label="Chiudi dettagli">✕</button>

      <div className="nv-detail">
        {/* Header */}
        <div className="nv-detail-header">
          <div className="nv-detail-title">
            <div className={`nv-detail-icon ${vehicle.type}`}>
              {(() => {
                const Icon = VEHICLE_ICONS[vehicle.type]
                return Icon ? <Icon size={22} /> : null
              })()}
            </div>
            <div>
              <div className="nv-detail-name">{vehicle.label}</div>
              <div className="nv-detail-type">{vehicle.type}</div>
            </div>
          </div>
          <span className="nv-detail-distance">{formatDistance(vehicle.distanceMeters)}</span>
        </div>

        {/* Stats */}
        <div className="nv-stats">
          <div className="nv-stat-card">
            <div className="nv-stat-label">🔋 Batteria</div>
            <div className={`nv-stat-value ${bClass}`} style={{ color: bClass === 'high' ? '#34d399' : bClass === 'medium' ? '#fbbf24' : '#f87171' }}>
              {vehicle.batteryLevel}%
            </div>
            <div className="nv-battery-track">
              <div
                className={`nv-battery-fill ${bClass}`}
                style={{ width: `${vehicle.batteryLevel}%` }}
              />
            </div>
          </div>

          <div className="nv-stat-card">
            <div className="nv-stat-label">📍 Distanza</div>
            <div className="nv-stat-value">{formatDistance(vehicle.distanceMeters)}</div>
          </div>
        </div>

        {/* Pricing */}
        <div className="nv-pricing">
          <div className="nv-price-tag">
            <span className="nv-price-tag-label">Sblocco</span>
            <span className="nv-price-tag-value">€{pricing.unlockCost.amount.toFixed(2)}</span>
          </div>
          <div className="nv-price-tag">
            <span className="nv-price-tag-label">Al minuto</span>
            <span className="nv-price-tag-value">€{pricing.perMinuteCost.amount.toFixed(2)}/min</span>
          </div>
        </div>

        {/* CTA */}
        <button
          className="nv-cta"
          id="btn-prenota-veicolo"
          onClick={() => navigate('/prenota', { state: { vehicle } })}
        >
          Prenota Mezzo
        </button>
      </div>
    </section>
  )
}

function VehicleListPanel({
  vehicles,
  onSelect,
  isCollapsed,
  onToggleCollapse,
  onStartScanning,
}: {
  vehicles: NearbyVehicle[]
  onSelect: (v: NearbyVehicle) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  onStartScanning: () => void
}) {
  return (
    <section className={`nv-panel${isCollapsed ? ' collapsed' : ''}`} aria-label="Lista veicoli vicini">
      {/* Floating QR scan button */}
      <button
        className="nv-qr-fab"
        onClick={onStartScanning}
        aria-label="Scansiona QR Code"
      >
        <QrCodeIcon size={22} />
      </button>

      <div className="nv-panel-handle" onClick={onToggleCollapse} />

      {vehicles.length === 0 ? (
        <div className="nv-panel-empty">
          <div className="nv-panel-empty-icon">🔍</div>
          Nessun veicolo trovato con questo filtro
        </div>
      ) : (
        <div className="nv-list">
          {vehicles.map((v) => {
            const bClass = batteryClass(v.batteryLevel)
            return (
              <div
                key={v.id}
                className="nv-list-item"
                onClick={() => onSelect(v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(v)}
                aria-label={`Seleziona ${v.label}`}
              >
                <div className={`nv-list-icon nv-detail-icon ${v.type}`}>
                  {(() => {
                    const Icon = VEHICLE_ICONS[v.type]
                    return Icon ? <Icon size={18} /> : null
                  })()}
                </div>
                <div className="nv-list-info">
                  <div className="nv-list-name">{v.label}</div>
                  <div className="nv-list-meta">
                    {formatDistance(v.distanceMeters)} · €{v.pricingPlan.unlockCost.toFixed(2)} sblocco
                  </div>
                </div>
                <div className="nv-list-battery">
                  <span className={`nv-list-battery-text ${bClass}`}>{v.batteryLevel}%</span>
                  <div className="nv-list-battery-bar">
                    <div
                      className={`nv-list-battery-fill nv-battery-fill ${bClass}`}
                      style={{ width: `${v.batteryLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
