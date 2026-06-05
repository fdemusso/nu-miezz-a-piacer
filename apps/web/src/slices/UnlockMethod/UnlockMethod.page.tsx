import { useUnlockMethod } from './UnlockMethod.hook'

export function UnlockMethodPage() {
  const { status } = useUnlockMethod()
  return (
    <div>
      <h2>UnlockMethod</h2>
      <p>{status}</p>
    </div>
  )
}
