import { useManageSupportTickets } from './ManageSupportTickets.hook'

export function ManageSupportTicketsPage() {
  const { status } = useManageSupportTickets()
  return (
    <div>
      <h2>ManageSupportTickets</h2>
      <p>{status}</p>
    </div>
  )
}
