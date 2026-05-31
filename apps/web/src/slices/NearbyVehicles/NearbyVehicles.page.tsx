import React from 'react'
import { useNearbyVehicles } from './NearbyVehicles.hook'

export function NearbyVehiclesPage() {
  const { loading, error } = useNearbyVehicles()

  return (
    <div>
      <h1>NearbyVehicles</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
