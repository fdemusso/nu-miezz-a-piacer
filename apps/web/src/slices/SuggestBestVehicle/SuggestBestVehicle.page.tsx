import { useSuggestBestVehicle } from './SuggestBestVehicle.hook'

export function SuggestBestVehiclePage() {
  const { status } = useSuggestBestVehicle()
  return (
    <div>
      <h2>SuggestBestVehicle</h2>
      <p>{status}</p>
    </div>
  )
}
