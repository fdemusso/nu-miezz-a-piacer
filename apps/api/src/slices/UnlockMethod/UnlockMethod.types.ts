import type { UnlockMethodType } from '@vsa/contracts'

export interface UnlockMethodRequest {
  vehicleId: string
}

export interface UnlockMethodResponse {
  methods: UnlockMethodType[]
}
