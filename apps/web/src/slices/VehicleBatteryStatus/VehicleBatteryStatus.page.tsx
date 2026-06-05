import { useVehicleBatteryStatus } from './VehicleBatteryStatus.hook'

export function VehicleBatteryStatusPage() {
  const { status } = useVehicleBatteryStatus()
  return (
    <div>
      <h2>VehicleBatteryStatus</h2>
      <p>{status}</p>
    </div>
  )
}
