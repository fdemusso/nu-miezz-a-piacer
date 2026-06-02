import { useState } from 'react'
import type { ConfigureParkingBonusViewState } from './ConfigureParkingBonus.types'

export function useConfigureParkingBonus(): ConfigureParkingBonusViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
