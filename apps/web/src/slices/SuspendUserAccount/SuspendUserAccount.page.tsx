import { useSuspendUserAccount } from './SuspendUserAccount.hook'

export function SuspendUserAccountPage() {
  const { status } = useSuspendUserAccount()
  return (
    <div>
      <h2>SuspendUserAccount</h2>
      <p>{status}</p>
    </div>
  )
}
