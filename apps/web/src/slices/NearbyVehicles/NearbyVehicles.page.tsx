import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useNearbyVehicles } from './NearbyVehicles.hook'
import type { NearbyVehicle, VehicleTypeFilter } from './NearbyVehicles.types'
import mapData from './Mappa0.json'

// ── Helpers ──────────────────────────────────────────────────────────────────

import { VEHICLE_ICONS } from '../../components/VehicleIcons'
export { VEHICLE_ICONS }

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

// coordinates translation helper is no longer needed since we render SVG coordinates natively!

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

  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const scannerDialogRef = React.useRef<HTMLDialogElement>(null)
  React.useEffect(() => {
    if (isScanning) {
      scannerDialogRef.current?.showModal()
    }
  }, [isScanning])

  // ── Pan and Zoom States ────────────────────────────────────────────────────
  const svgRef = React.useRef<SVGSVGElement>(null)
  const [zoom, setZoom] = React.useState(1.0)
  const [pan, setPan] = React.useState({ x: 0, y: 0 })
  const [containerWidth, setContainerWidth] = React.useState(400)
  const [dragState, setDragState] = React.useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
  })

  // Monitor container width dynamically to scale icons perfectly
  React.useEffect(() => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    if (rect.width) {
      setContainerWidth(rect.width)
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width) {
          setContainerWidth(entry.contentRect.width)
        }
      }
    })
    resizeObserver.observe(svgRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  // Standard viewBox bounds of Mappa0.json
  const BASE_W = 5800
  const BASE_H = 5900
  const cx = 100
  const cy = -150

  const w = BASE_W / zoom
  const h = BASE_H / zoom
  const x = cx - w / 2 + pan.x
  const y = cy - h / 2 + pan.y

  const viewBoxString = `${x} ${y} ${w} ${h}`

  // Ratio mapping 1 screen pixel to SVG coordinate units
  const svgUnitsPerPixel = w / containerWidth

  const handleStart = (clientX: number, clientY: number) => {
    setDragState({
      isDragging: true,
      startX: clientX,
      startY: clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    })
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragState.isDragging) return
    const container = svgRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const containerWidth = rect.width || 400
    const containerHeight = rect.height || 400

    const dx = clientX - dragState.startX
    const dy = clientY - dragState.startY

    // Screen pixel to SVG map coordinates scaling factor
    const svgDx = dx * (w / containerWidth)
    const svgDy = dy * (h / containerHeight)

    setPan({
      x: dragState.startPanX - svgDx,
      y: dragState.startPanY - svgDy,
    })
  }

  const handleEnd = () => {
    setDragState((prev) => ({ ...prev, isDragging: false }))
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only drag on left click
    handleStart(e.clientX, e.clientY)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const onMouseUp = () => {
    handleEnd()
  }

  const onMouseLeave = () => {
    handleEnd()
  }

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const onTouchEnd = () => {
    handleEnd()
  }

  const onWheel = (e: React.WheelEvent) => {
    // Zoom in or out relative to center
    const zoomFactor = 1.15
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(z * zoomFactor, 35.0))
    } else {
      setZoom((z) => Math.max(z / zoomFactor, 0.4))
    }
  }

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

  if (loading) return <div className="nv-page"><p style={{ padding: 24 }}>Caricamento…</p></div>
  if (error) return <div className="nv-page"><p style={{ padding: 24, color: '#f87171' }}>{error}</p></div>

  return (
    <div className="nv-page">
      {/* ── Simulated Map ── */}
      <div className="nv-map" aria-label="Mappa veicoli">
        {/* ── Vector SVG Map Layer ── */}
        <svg
          ref={svgRef}
          viewBox={viewBoxString}
          className="nv-vector-map"
          xmlns="http://www.w3.org/2000/svg"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onWheel={onWheel}
          style={{ cursor: dragState.isDragging ? 'grabbing' : 'grab', userSelect: 'none', touchAction: 'none' }}
        >
          {/* Earth / Land */}
          {(() => {
            const earthFeature = mapData.features.find((f) => f.id === 'earth')
            if (!earthFeature || !earthFeature.coordinates) return null
            const pointsStr = (earthFeature.coordinates[0] as [number, number][]).map(([x, y]) => `${x},${y}`).join(' ')
            return <polygon points={pointsStr} className="map-layer-earth" />
          })()}

          {/* Greens */}
          {(() => {
            const greensFeature = mapData.features.find((f) => f.id === 'greens')
            if (!greensFeature || !greensFeature.coordinates) return null
            return greensFeature.coordinates.map((polygonList: any, idx: number) => {
              const outerRing = polygonList[0] as [number, number][]
              const pointsStr = outerRing.map(([x, y]) => `${x},${y}`).join(' ')
              return <polygon key={`green-${idx}`} points={pointsStr} className="map-layer-green" />
            })
          })()}

          {/* Fields */}
          {(() => {
            const fieldsFeature = mapData.features.find((f) => f.id === 'fields')
            if (!fieldsFeature || !fieldsFeature.coordinates) return null
            return fieldsFeature.coordinates.map((polygonList: any, idx: number) => {
              const outerRing = polygonList[0] as [number, number][]
              const pointsStr = outerRing.map(([x, y]) => `${x},${y}`).join(' ')
              return <polygon key={`field-${idx}`} points={pointsStr} className="map-layer-field" />
            })
          })()}

          {/* Squares */}
          {(() => {
            const squaresFeature = mapData.features.find((f) => f.id === 'squares')
            if (!squaresFeature || !squaresFeature.coordinates) return null
            return squaresFeature.coordinates.map((polygonList: any, idx: number) => {
              const outerRing = polygonList[0] as [number, number][]
              const pointsStr = outerRing.map(([x, y]) => `${x},${y}`).join(' ')
              return <polygon key={`square-${idx}`} points={pointsStr} className="map-layer-square" />
            })
          })()}

          {/* Rivers */}
          {(() => {
            const riversFeature = mapData.features.find((f) => f.id === 'rivers')
            if (!riversFeature || !riversFeature.geometries) return null
            return riversFeature.geometries.map((g: any, idx: number) => {
              if (g.type === 'LineString') {
                const pointsStr = (g.coordinates as [number, number][]).map(([x, y]) => `${x},${y}`).join(' ')
                return <polyline key={`river-${idx}`} points={pointsStr} className="map-layer-river" strokeWidth={g.width || 20} />
              }
              return null
            })
          })()}

          {/* Buildings */}
          {(() => {
            const buildingsFeature = mapData.features.find((f) => f.id === 'buildings')
            if (!buildingsFeature || !buildingsFeature.coordinates) return null
            return buildingsFeature.coordinates.map((polygonList: any, idx: number) => {
              const outerRing = polygonList[0] as [number, number][]
              const pointsStr = outerRing.map(([x, y]) => `${x},${y}`).join(' ')
              return <polygon key={`building-${idx}`} points={pointsStr} className="map-layer-building" />
            })
          })()}

          {/* Walls */}
          {(() => {
            const wallsFeature = mapData.features.find((f) => f.id === 'walls')
            if (!wallsFeature || !wallsFeature.geometries) return null
            return wallsFeature.geometries.map((g: any, idx: number) => {
              if (g.type === 'LineString') {
                const pointsStr = (g.coordinates as [number, number][]).map(([x, y]) => `${x},${y}`).join(' ')
                return <polyline key={`wall-${idx}`} points={pointsStr} className="map-layer-wall" strokeWidth={g.width || 8} />
              }
              return null
            })
          })()}

          {/* Roads */}
          {(() => {
            const roadsFeature = mapData.features.find((f) => f.id === 'roads')
            if (!roadsFeature || !roadsFeature.geometries) return null
            return roadsFeature.geometries.map((g: any, idx: number) => {
              if (g.type === 'LineString') {
                const pointsStr = (g.coordinates as [number, number][]).map(([x, y]) => `${x},${y}`).join(' ')
                return <polyline key={`road-${idx}`} points={pointsStr} className={`map-layer-road width-${g.width || 8}`} strokeWidth={g.width || 8} />
              }
              return null
            })
          })()}

          {/* ── SVG Space Overlays ── */}

          {/* User Marker */}
          {(() => {
            const userOuterRadius = 15 * svgUnitsPerPixel
            const userOuterStroke = 3 * svgUnitsPerPixel
            const userInnerRadius = 7 * svgUnitsPerPixel

            return (
              <g className="map-overlay-user">
                <circle cx="50" cy="-10" r="150" className="map-user-radar" />
                <circle
                  cx="50"
                  cy="-10"
                  r={userOuterRadius}
                  className="map-user-dot-outer"
                  style={{ strokeWidth: `${userOuterStroke}px` }}
                />
                <circle
                  cx="50"
                  cy="-10"
                  r={userInnerRadius}
                  className="map-user-dot-inner"
                />
              </g>
            )
          })()}

          {/* Vehicle pins */}
          {vehicles.map((v) => {
            const isSelected = selectedVehicle?.id === v.id
            const Icon = VEHICLE_ICONS[v.type]
            const cx = v.position.lng
            const cy = v.position.lat

            // Compensate coordinate scaling so pins sit at exactly 44px on screen
            const baseRadius = 22 * svgUnitsPerPixel
            const baseIconSize = 24 * svgUnitsPerPixel
            const strokeWidth = (isSelected ? 3.5 : 2.0) * svgUnitsPerPixel

            return (
              <g
                key={v.id}
                className={`map-svg-pin nv-pin--${v.type}${isSelected ? ' selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  selectVehicle(isSelected ? null : v)
                  setIsCollapsed(false)
                }}
                style={{
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.15)' : 'none',
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: 'transform 0.2s var(--ease-smooth)',
                }}
                role="button"
                tabIndex={0}
                aria-label={`${v.label} — batteria ${v.batteryLevel}%`}
              >
                {/* Visual pin circle background */}
                <circle cx={cx} cy={cy} r={baseRadius} className="map-pin-circle-bg" />
                <circle
                  cx={cx}
                  cy={cy}
                  r={baseRadius}
                  className="map-pin-circle-border"
                  style={{ strokeWidth: `${strokeWidth}px` }}
                />
                {/* Vector SVG Icon centered at coordinates (cx, cy) */}
                <g transform={`translate(${cx - baseIconSize / 2}, ${cy - baseIconSize / 2})`}>
                  {Icon && <Icon size={baseIconSize} />}
                </g>
              </g>
            )
          })}
        </svg>

        {/* ── Filter Chips (inside map for correct stacking) ── */}
        <div className="nv-filter-bar" role="tablist" aria-label="Filtra per tipo di veicolo">
          {FILTERS.map(({ value, label }) => {
            const Icon = VEHICLE_ICONS[value]
            return (
              <button
                type="button"
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

        {/* User position label */}
        <div className="nv-user-label">
          <span className="nv-user-dot" />
          La tua posizione
        </div>

        {/* ── Map Controls (Zoom in, Zoom out, Recenter) ── */}
        <div className="nv-map-controls">
          <button
            type="button"
            className="nv-control-btn"
            onClick={() => setZoom((z) => Math.min(z * 1.2, 35.0))}
            aria-label="Ingrandisci"
            title="Ingrandisci"
          >
            ＋
          </button>
          <button
            type="button"
            className="nv-control-btn"
            onClick={() => setZoom((z) => Math.max(z / 1.2, 0.4))}
            aria-label="Rimpicciolisci"
            title="Rimpicciolisci"
          >
            －
          </button>
          <button
            type="button"
            className="nv-control-btn recenter"
            onClick={() => {
              setZoom(1.0)
              setPan({ x: 0, y: 0 })
            }}
            aria-label="Centra sulla mia posizione"
            title="Centra sulla mia posizione"
          >
            🎯
          </button>
        </div>
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
        <dialog
          ref={scannerDialogRef}
          className="nv-scanner-overlay"
          aria-label="Scansione QR Code"
          onCancel={(e) => {
            e.preventDefault()
            stopScanning()
          }}
        >
          <button type="button" className="nv-scanner-close" onClick={stopScanning} aria-label="Chiudi scanner">✕</button>
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
        </dialog>
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

  return (
    <section className={`nv-panel${isCollapsed ? ' collapsed' : ''}`} aria-label={`Dettagli ${vehicle.label}`}>
      {/* Floating QR scan button */}
      <button
        type="button"
        className="nv-qr-fab"
        onClick={onStartScanning}
        aria-label="Scansiona QR Code"
      >
        <QrCodeIcon size={22} />
      </button>

      <div className="nv-panel-handle" onClick={onToggleCollapse} />
      <button type="button" className="nv-close-btn" onClick={onClose} aria-label="Chiudi dettagli">✕</button>

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
            <span className="nv-price-tag-value">€{vehicle.pricingPlan.unlockCost.toFixed(2)}</span>
          </div>
          <div className="nv-price-tag">
            <span className="nv-price-tag-label">Al minuto</span>
            <span className="nv-price-tag-value">€{vehicle.pricingPlan.perMinuteCost.toFixed(2)}/min</span>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
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
        type="button"
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
              <button
                type="button"
                key={v.id}
                className="nv-list-item"
                onClick={() => onSelect(v)}
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
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
