import { useState } from 'react'
import type { OpenSupportTicketViewState } from './OpenSupportTicket.types'

export function useOpenSupportTicket(): OpenSupportTicketViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
