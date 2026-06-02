import { useBookVehicle } from './BookVehicle.hook'
import { VEHICLE_ICONS } from '../../components/VehicleIcons'

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

function formatDistance(meters: number) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${meters} m`
}

export function BookVehiclePage() {
  const {
    loading,
    error,
    vehicle,
    formattedTime,
    isExpired,
    cancelBooking,
    unlockVehicle,
  } = useBookVehicle()

  if (loading) {
    return (
      <div className="bv-page">
        <p className="bv-loading">Caricamento prenotazione…</p>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="bv-page">
        <p className="bv-error">{error || 'Impossibile trovare il veicolo prenotato.'}</p>
        <button type="button" className="bv-btn-secondary" onClick={cancelBooking}>
          Torna alla mappa
        </button>
      </div>
    )
  }

  const bClass = batteryClass(vehicle.batteryLevel)

  return (
    <div className="bv-page">
      {/* Header */}
      <header className="bv-header">
        <button type="button" className="bv-back-btn" onClick={cancelBooking} aria-label="Torna indietro">
          ←
        </button>
        <h1 className="bv-title">Veicolo Prenotato</h1>
      </header>

      <main className="bv-content">
        {/* Timer Card */}
        <section className={`bv-timer-card${isExpired ? ' expired' : ''}`} aria-label="Conto alla rovescia prenotazione">
          <div className="bv-timer-circle">
            <span className="bv-timer-time" id="booking-timer">
              {isExpired ? '00:00' : formattedTime}
            </span>
            <span className="bv-timer-sub">minuti rimanenti</span>
          </div>
          <p className="bv-timer-hint">
            {isExpired
              ? 'Il tempo massimo di raggiungimento del mezzo è scaduto.'
              : 'Raggiungi il mezzo ed effettua lo sblocco entro il tempo indicato.'}
          </p>
        </section>

        {/* Vehicle Info Card */}
        <section className="bv-vehicle-card" aria-label={`Dettagli mezzo ${vehicle.label}`}>
          <div className="bv-vehicle-header">
            <div className={`bv-vehicle-icon ${vehicle.type}`}>
              {(() => {
                const Icon = VEHICLE_ICONS[vehicle.type]
                return Icon ? <Icon size={24} /> : null
              })()}
            </div>
            <div className="bv-vehicle-details">
              <h2 className="bv-vehicle-name">{vehicle.label}</h2>
              <p className="bv-vehicle-type">{VEHICLE_TYPE_LABEL[vehicle.type] || vehicle.type}</p>
            </div>
            <span className="bv-vehicle-distance">{formatDistance(vehicle.distanceMeters)}</span>
          </div>

          <div className="bv-vehicle-stats">
            {/* Battery Stat */}
            <div className="bv-stat">
              <span className="bv-stat-label">🔋 Batteria</span>
              <div className="bv-battery-row">
                <span className={`bv-stat-value ${bClass}`} style={{ color: bClass === 'high' ? '#34d399' : bClass === 'medium' ? '#fbbf24' : '#f87171' }}>
                  {vehicle.batteryLevel}%
                </span>
                <div className="bv-battery-track">
                  <div
                    className={`bv-battery-fill ${bClass}`}
                    style={{ width: `${vehicle.batteryLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Price Plan */}
            <div className="bv-pricing-preview">
              <div className="bv-price-row">
                <span className="bv-price-label">Tariffa Sblocco:</span>
                <span className="bv-price-value">€{vehicle.pricingPlan.unlockCost.toFixed(2)}</span>
              </div>
              <div className="bv-price-row">
                <span className="bv-price-label">Tariffa al minuto:</span>
                <span className="bv-price-value">€{vehicle.pricingPlan.perMinuteCost.toFixed(2)}/min</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <div className="bv-actions">
          <button
            type="button"
            className="bv-btn-primary"
            id="btn-sblocca-veicolo"
            onClick={unlockVehicle}
            disabled={isExpired}
          >
            🚀 Sblocca Mezzo
          </button>
          
          <button
            type="button"
            className="bv-btn-secondary"
            id="btn-annulla-prenotazione"
            onClick={cancelBooking}
          >
            Annulla Prenotazione
          </button>
        </div>
      </main>
    </div>
  )
}
