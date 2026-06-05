import { useNearbyVehicles } from './NearbyVehicles.hook'

export function NearbyVehiclesPage() {
  const { status } = useNearbyVehicles()
  return (
    <div>
      <h2>NearbyVehicles</h2>
      <p>{status}</p>
    </div>
  )
}
