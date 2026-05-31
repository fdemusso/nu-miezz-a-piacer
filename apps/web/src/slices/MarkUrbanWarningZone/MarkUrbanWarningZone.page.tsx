import React from 'react'
import { useMarkUrbanWarningZone } from './MarkUrbanWarningZone.hook'

export function MarkUrbanWarningZonePage() {
  const { loading, error } = useMarkUrbanWarningZone()

  return (
    <div>
      <h1>MarkUrbanWarningZone</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
