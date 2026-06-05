import { useManagePaymentMethod } from './ManagePaymentMethod.hook'

export function ManagePaymentMethodPage() {
  const { status } = useManagePaymentMethod()
  return (
    <div>
      <h2>ManagePaymentMethod</h2>
      <p>{status}</p>
    </div>
  )
}
