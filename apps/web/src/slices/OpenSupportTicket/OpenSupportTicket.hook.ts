import { useState } from 'react'
import type { OpenSupportTicketViewState } from './OpenSupportTicket.types'

export function useOpenSupportTicket(): OpenSupportTicketViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
