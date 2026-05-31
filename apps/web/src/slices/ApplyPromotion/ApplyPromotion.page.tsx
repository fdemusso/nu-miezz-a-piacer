import React from 'react'
import { useApplyPromotion } from './ApplyPromotion.hook'

export function ApplyPromotionPage() {
  const { loading, error } = useApplyPromotion()

  return (
    <div>
      <h1>ApplyPromotion</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
