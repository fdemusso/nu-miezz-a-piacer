import { usePauseRide } from './PauseRide.hook'

export function PauseRidePage() {
  const { status } = usePauseRide()
  return (
    <div>
      <h2>PauseRide</h2>
      <p>{status}</p>
    </div>
  )
}
