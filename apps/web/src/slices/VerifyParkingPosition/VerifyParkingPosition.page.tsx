import { useVerifyParkingPosition } from './VerifyParkingPosition.hook'

export function VerifyParkingPositionPage() {
  const { status } = useVerifyParkingPosition()
  return (
    <div>
      <h2>VerifyParkingPosition</h2>
      <p>{status}</p>
    </div>
  )
}
