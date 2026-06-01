import React from 'react'
import { usePauseRide } from './PauseRide.hook'
import { VEHICLE_ICONS } from '../NearbyVehicles/NearbyVehicles.page'

const VEHICLE_TYPE_LABEL: Record<string, string> = {
  scooter: 'Monopattino Elettrico',
  bike: 'Bicicletta Meccanica',
  ebike: 'E-Bike Assistita',
  car: 'Auto Elettrica',
}

function batteryClass(level: number) {
  if (level >= 60) return 'high'
  if (level >= 25) return 'medium'
  return 'low'
}

export function PauseRidePage() {
  const {
    loading,
    error,
    vehicle,
    formattedTime,
    estimatedCost,
    isPaused,
    togglePause,
    isEndingRide,
    endRide,
  } = usePauseRide()

  if (loading) {
    return (
      <div className="pr-page">
        <p className="pr-loading">Caricamento corsa in corso…</p>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="pr-page">
        <p className="pr-error">{error || 'Impossibile trovare la corsa attiva.'}</p>
      </div>
    )
  }

  const bClass = batteryClass(vehicle.batteryLevel)
  const Icon = VEHICLE_ICONS[vehicle.type]

  return (
    <div className="pr-page">
      {/* Header */}
      <header className="pr-header">
        <div className="pr-status-badge">
          <span className={`pr-status-dot${isPaused ? ' paused' : ' active'}`} />
          {isPaused ? 'In Sosta' : 'Corsa Attiva'}
        </div>
        <h1 className="pr-title">Dettagli Noleggio</h1>
      </header>

      <main className="pr-content">
        {/* Live Status Board (Timer + Cost) */}
        <section className={`pr-status-board${isPaused ? ' paused' : ''}`} aria-label="Stato noleggio in tempo reale">
          <div className="pr-timer-section">
            <span className="pr-timer-time" id="ride-timer">
              {formattedTime}
            </span>
            <span className="pr-timer-label">tempo trascorso</span>
          </div>

          <div className="pr-divider" />

          <div className="pr-cost-section">
            <span className="pr-cost-amount" id="ride-cost">
              €{estimatedCost.toFixed(2)}
            </span>
            <span className="pr-cost-label">costo stimato</span>
          </div>
        </section>

        {/* Active Vehicle Info */}
        <section className="pr-vehicle-card" aria-label={`Veicolo in uso ${vehicle.label}`}>
          <div className="pr-vehicle-header">
            <div className={`pr-vehicle-icon ${vehicle.type}`}>
              {Icon && <Icon size={24} />}
            </div>
            <div className="pr-vehicle-details">
              <h2 className="pr-vehicle-name">{vehicle.label}</h2>
              <p className="pr-vehicle-type">{VEHICLE_TYPE_LABEL[vehicle.type] || vehicle.type}</p>
            </div>
            <span className={`pr-battery-text ${bClass}`}>{vehicle.batteryLevel}%</span>
          </div>
          
          <div className="pr-battery-track">
            <div
              className={`pr-battery-fill ${bClass}`}
              style={{ width: `${vehicle.batteryLevel}%` }}
            />
          </div>
        </section>

        {/* Temporary Pause Switch (IF15) */}
        <section className="pr-pause-card">
          <div className="pr-pause-info">
            <h3 className="pr-pause-title">Sosta Temporanea</h3>
            <p className="pr-pause-desc">
              {isPaused
                ? 'Tariffa di pausa ridotta attiva. Il mezzo rimane riservato a te.'
                : 'Metti in pausa la corsa per fermarti senza perdere il mezzo.'}
            </p>
          </div>
          <button
            className={`pr-toggle-switch${isPaused ? ' active' : ''}`}
            onClick={togglePause}
            role="switch"
            aria-checked={isPaused}
            aria-label="Attiva sosta temporanea"
          >
            <span className="pr-toggle-thumb" />
          </button>
        </section>

        {/* End Ride Action */}
        <div className="pr-actions">
          <button
            className="pr-btn-danger"
            id="btn-termina-corsa"
            onClick={endRide}
            disabled={isEndingRide}
          >
            Termina Corsa
          </button>
        </div>
      </main>

      {/* Fullscreen GPS Parking Validation Loading Overlay */}
      {isEndingRide && (
        <div className="pr-overlay" role="dialog" aria-modal="true" aria-label="Validazione parcheggio">
          <div className="pr-overlay-container">
            <div className="pr-radar-wrapper">
              <div className="pr-radar-circle wave-1" />
              <div className="pr-radar-circle wave-2" />
              <div className="pr-radar-dot" />
            </div>
            <h3 className="pr-overlay-title">Verifica Parcheggio</h3>
            <p className="pr-overlay-desc">Validazione posizione GPS del veicolo in corso...</p>
            <div className="pr-progress-track">
              <div className="pr-progress-fill" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
