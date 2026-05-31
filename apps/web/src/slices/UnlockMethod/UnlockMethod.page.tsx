import React from 'react'
import { useUnlockMethod } from './UnlockMethod.hook'

export function UnlockMethodPage() {
  const { loading, error } = useUnlockMethod()

  return (
    <div>
      <h1>UnlockMethod</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
