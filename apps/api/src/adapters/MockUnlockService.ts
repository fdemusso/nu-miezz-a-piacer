import type { Vehicle, UnlockMethodType, IUnlockService } from '@vsa/contracts'

export class MockUnlockService implements IUnlockService {
  private unlocked = new Set<string>()

  async unlock(vehicleId: string, _method: UnlockMethodType): Promise<void> {
    this.unlocked.add(vehicleId)
  }

  async lock(vehicleId: string): Promise<void> {
    this.unlocked.delete(vehicleId)
  }

  async getAvailableMethods(vehicle: Vehicle): Promise<UnlockMethodType[]> {
    if (vehicle.type === 'car') return ['app', 'nfc']
    return ['qr', 'app']
  }

  isUnlockedForTest(vehicleId: string): boolean { return this.unlocked.has(vehicleId) }
}
