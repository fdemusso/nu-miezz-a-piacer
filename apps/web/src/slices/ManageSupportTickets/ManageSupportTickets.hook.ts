import { useState } from 'react'
import type { ManageSupportTicketsViewState } from './ManageSupportTickets.types'

export function useManageSupportTickets(): ManageSupportTicketsViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
