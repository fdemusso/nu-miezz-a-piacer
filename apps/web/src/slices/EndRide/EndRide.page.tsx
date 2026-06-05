import { useEndRide } from './EndRide.hook'

export function EndRidePage() {
  const { status } = useEndRide()
  return (
    <div>
      <h2>EndRide</h2>
      <p>{status}</p>
    </div>
  )
}
