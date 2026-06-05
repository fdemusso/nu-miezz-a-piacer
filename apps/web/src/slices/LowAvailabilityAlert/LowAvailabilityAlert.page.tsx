import { useLowAvailabilityAlert } from './LowAvailabilityAlert.hook'

export function LowAvailabilityAlertPage() {
  const { status } = useLowAvailabilityAlert()
  return (
    <div>
      <h2>LowAvailabilityAlert</h2>
      <p>{status}</p>
    </div>
  )
}
