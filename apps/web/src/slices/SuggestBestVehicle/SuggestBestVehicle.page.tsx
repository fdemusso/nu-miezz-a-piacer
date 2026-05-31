import React from 'react'
import { useSuggestBestVehicle } from './SuggestBestVehicle.hook'

export function SuggestBestVehiclePage() {
  const { loading, error } = useSuggestBestVehicle()

  return (
    <div>
      <h1>SuggestBestVehicle</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
