import { useVehicleDetails } from './VehicleDetails.hook'

export function VehicleDetailsPage() {
  const { status } = useVehicleDetails()
  return (
    <div>
      <h2>VehicleDetails</h2>
      <p>{status}</p>
    </div>
  )
}
