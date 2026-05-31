import React from 'react'
import { useConfigureParkingBonus } from './ConfigureParkingBonus.hook'

export function ConfigureParkingBonusPage() {
  const { loading, error } = useConfigureParkingBonus()

  return (
    <div>
      <h1>ConfigureParkingBonus</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
