import { useVehicleGPSHistory } from './VehicleGPSHistory.hook'

export function VehicleGPSHistoryPage() {
  const { status } = useVehicleGPSHistory()
  return (
    <div>
      <h2>VehicleGPSHistory</h2>
      <p>{status}</p>
    </div>
  )
}
