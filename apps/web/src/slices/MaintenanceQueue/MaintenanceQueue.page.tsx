import { useMaintenanceQueue } from './MaintenanceQueue.hook'

export function MaintenanceQueuePage() {
  const { loading, error } = useMaintenanceQueue()

  return (
    <div>
      <h1>MaintenanceQueue</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
