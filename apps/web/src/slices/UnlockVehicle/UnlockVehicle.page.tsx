import { useUnlockVehicle } from './UnlockVehicle.hook'

export function UnlockVehiclePage() {
  const { status } = useUnlockVehicle()
  return (
    <div>
      <h2>UnlockVehicle</h2>
      <p>{status}</p>
    </div>
  )
}
