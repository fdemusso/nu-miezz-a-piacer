import { useExpiredBookingsMonitor } from './ExpiredBookingsMonitor.hook'

export function ExpiredBookingsMonitorPage() {
  const { status } = useExpiredBookingsMonitor()
  return (
    <div>
      <h2>ExpiredBookingsMonitor</h2>
      <p>{status}</p>
    </div>
  )
}
