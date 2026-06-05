import { useApplyPromotion } from './ApplyPromotion.hook'

export function ApplyPromotionPage() {
  const { status } = useApplyPromotion()
  return (
    <div>
      <h2>ApplyPromotion</h2>
      <p>{status}</p>
    </div>
  )
}
