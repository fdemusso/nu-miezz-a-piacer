import React from 'react'
import { useVehicleDetails } from './VehicleDetails.hook'

export function VehicleDetailsPage() {
  const { loading, error } = useVehicleDetails()

  return (
    <div>
      <h1>VehicleDetails</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
