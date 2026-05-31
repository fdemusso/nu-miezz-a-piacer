import React from 'react'
import { useEndRide } from './EndRide.hook'

export function EndRidePage() {
  const { loading, error } = useEndRide()

  return (
    <div>
      <h1>EndRide</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
