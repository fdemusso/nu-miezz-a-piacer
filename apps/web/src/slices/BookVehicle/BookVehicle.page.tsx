import React from 'react'
import { useBookVehicle } from './BookVehicle.hook'

export function BookVehiclePage() {
  const { loading, error } = useBookVehicle()

  return (
    <div>
      <h1>BookVehicle</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
