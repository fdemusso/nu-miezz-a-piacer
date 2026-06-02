import { useVehicleGPSHistory } from './VehicleGPSHistory.hook'

export function VehicleGPSHistoryPage() {
  const { loading, error } = useVehicleGPSHistory()

  return (
    <div>
      <h1>VehicleGPSHistory</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
