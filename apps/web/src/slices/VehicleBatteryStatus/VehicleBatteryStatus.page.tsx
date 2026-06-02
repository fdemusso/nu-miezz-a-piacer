import { useVehicleBatteryStatus } from './VehicleBatteryStatus.hook'

export function VehicleBatteryStatusPage() {
  const { loading, error } = useVehicleBatteryStatus()

  return (
    <div>
      <h1>VehicleBatteryStatus</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
