import React from 'react'
import { useManagePaymentMethod } from './ManagePaymentMethod.hook'

export function ManagePaymentMethodPage() {
  const { loading, error } = useManagePaymentMethod()

  return (
    <div>
      <h1>ManagePaymentMethod</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
