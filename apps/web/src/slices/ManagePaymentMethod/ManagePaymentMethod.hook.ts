import { useState } from 'react'
import type { ManagePaymentMethodViewState } from './ManagePaymentMethod.types'

export function useManagePaymentMethod(): ManagePaymentMethodViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
