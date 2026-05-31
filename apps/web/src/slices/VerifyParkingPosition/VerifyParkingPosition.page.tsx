import React from 'react'
import { useVerifyParkingPosition } from './VerifyParkingPosition.hook'

export function VerifyParkingPositionPage() {
  const { loading, error } = useVerifyParkingPosition()

  return (
    <div>
      <h1>VerifyParkingPosition</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
