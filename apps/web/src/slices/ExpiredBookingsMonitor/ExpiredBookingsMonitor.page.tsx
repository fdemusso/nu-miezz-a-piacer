import React from 'react'
import { useExpiredBookingsMonitor } from './ExpiredBookingsMonitor.hook'

export function ExpiredBookingsMonitorPage() {
  const { loading, error } = useExpiredBookingsMonitor()

  return (
    <div>
      <h1>ExpiredBookingsMonitor</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
