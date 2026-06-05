import { useRemoteLockVehicle } from './RemoteLockVehicle.hook'

export function RemoteLockVehiclePage() {
  const { status } = useRemoteLockVehicle()
  return (
    <div>
      <h2>RemoteLockVehicle</h2>
      <p>{status}</p>
    </div>
  )
}
