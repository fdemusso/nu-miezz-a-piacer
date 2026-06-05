import { useState } from 'react'
import type { ConfigureParkingBonusViewState } from './ConfigureParkingBonus.types'

export function useConfigureParkingBonus(): ConfigureParkingBonusViewState {
  const [status] = useState<ConfigureParkingBonusViewState['status']>('idle')
  return { status }
}
