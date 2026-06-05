import { useState } from 'react'
import type { OpenSupportTicketViewState } from './OpenSupportTicket.types'

export function useOpenSupportTicket(): OpenSupportTicketViewState {
  const [status] = useState<OpenSupportTicketViewState['status']>('idle')
  return { status }
}
