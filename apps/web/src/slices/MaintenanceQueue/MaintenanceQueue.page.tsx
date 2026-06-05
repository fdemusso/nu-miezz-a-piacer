import { useMaintenanceQueue } from './MaintenanceQueue.hook'

export function MaintenanceQueuePage() {
  const { status } = useMaintenanceQueue()
  return (
    <div>
      <h2>MaintenanceQueue</h2>
      <p>{status}</p>
    </div>
  )
}
