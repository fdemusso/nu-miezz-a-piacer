import { useManageSupportTickets } from './ManageSupportTickets.hook'

export function ManageSupportTicketsPage() {
  const { loading, error } = useManageSupportTickets()

  return (
    <div>
      <h1>ManageSupportTickets</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
