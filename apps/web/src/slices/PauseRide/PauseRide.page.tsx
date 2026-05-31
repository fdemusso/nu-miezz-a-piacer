import React from 'react'
import { usePauseRide } from './PauseRide.hook'

export function PauseRidePage() {
  const { loading, error } = usePauseRide()

  return (
    <div>
      <h1>PauseRide</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
