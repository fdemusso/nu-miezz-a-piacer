import React from 'react'
import { useLowAvailabilityAlert } from './LowAvailabilityAlert.hook'

export function LowAvailabilityAlertPage() {
  const { loading, error } = useLowAvailabilityAlert()

  return (
    <div>
      <h1>LowAvailabilityAlert</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
