import React from 'react'
import { useReceiveMalfunctionReport } from './ReceiveMalfunctionReport.hook'

export function ReceiveMalfunctionReportPage() {
  const { loading, error } = useReceiveMalfunctionReport()

  return (
    <div>
      <h1>ReceiveMalfunctionReport</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
