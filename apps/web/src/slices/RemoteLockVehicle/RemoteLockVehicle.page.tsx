import React from 'react'
import { useRemoteLockVehicle } from './RemoteLockVehicle.hook'

export function RemoteLockVehiclePage() {
  const { loading, error } = useRemoteLockVehicle()

  return (
    <div>
      <h1>RemoteLockVehicle</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
