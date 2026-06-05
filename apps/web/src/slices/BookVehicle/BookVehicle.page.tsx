import { useBookVehicle } from './BookVehicle.hook'

export function BookVehiclePage() {
  const { status } = useBookVehicle()
  return (
    <div>
      <h2>BookVehicle</h2>
      <p>{status}</p>
    </div>
  )
}
