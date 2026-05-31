import React from 'react'
import { useReportDamagedVehicle } from './ReportDamagedVehicle.hook'

export function ReportDamagedVehiclePage() {
  const { loading, error } = useReportDamagedVehicle()

  return (
    <div>
      <h1>ReportDamagedVehicle</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
