import { useUnlockVehicle } from './UnlockVehicle.hook'

export function UnlockVehiclePage() {
  const { loading, error } = useUnlockVehicle()

  return (
    <div>
      <h1>UnlockVehicle</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
