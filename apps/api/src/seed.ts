import { SqliteUserRepository, SqliteVehicleRepository, SqliteZoneRepository, SqliteFleetZoneRepository } from './adapters/repositories'
import type { User, Vehicle, ZoneRule, FleetZone } from '@vsa/contracts'

const userRepo = new SqliteUserRepository()
const vehicleRepo = new SqliteVehicleRepository()
const zoneRepo = new SqliteZoneRepository()
const fleetZoneRepo = new SqliteFleetZoneRepository()

const users: User[] = [
  { id: 'u-customer-1', email: 'customer@test.com', role: 'customer', name: 'Mario Rossi', suspended: false },
  { id: 'u-operator-1', email: 'operator@test.com', role: 'operator', name: 'Giulia Verdi', suspended: false },
  { id: 'u-admin-1',    email: 'admin@test.com',    role: 'admin',    name: 'Luca Bianchi', suspended: false },
]

const vehicles: Vehicle[] = [
  { id: 'v-1', type: 'scooter', status: 'available', batteryLevel: 90, position: { lat: 40.8518, lng: 14.2681 }, licensePlate: 'NA001AA' },
  { id: 'v-2', type: 'ebike',   status: 'available', batteryLevel: 75, position: { lat: 40.8530, lng: 14.2700 }, licensePlate: 'NA002BB' },
  { id: 'v-3', type: 'bike',    status: 'available', batteryLevel: 100, position: { lat: 40.8510, lng: 14.2660 }, licensePlate: 'NA003CC' },
  { id: 'v-4', type: 'car',     status: 'available', batteryLevel: 60, position: { lat: 40.8550, lng: 14.2720 }, licensePlate: 'NA004DD' },
  { id: 'v-5', type: 'scooter', status: 'maintenance', batteryLevel: 20, position: { lat: 40.8490, lng: 14.2640 }, licensePlate: 'NA005EE' },
]

const zones: ZoneRule[] = [
  {
    id: 'z-1', type: 'parking', name: 'Parcheggio Centro',
    boundary: [{ lat: 40.850, lng: 14.265 }, { lat: 40.852, lng: 14.265 }, { lat: 40.852, lng: 14.270 }, { lat: 40.850, lng: 14.270 }],
  },
  {
    id: 'z-2', type: 'forbidden', name: 'ZTL Storico',
    boundary: [{ lat: 40.848, lng: 14.260 }, { lat: 40.850, lng: 14.260 }, { lat: 40.850, lng: 14.265 }, { lat: 40.848, lng: 14.265 }],
  },
  {
    id: 'z-3', type: 'incentive', name: 'Zona Incentivo Porto',
    boundary: [{ lat: 40.845, lng: 14.268 }, { lat: 40.847, lng: 14.268 }, { lat: 40.847, lng: 14.273 }, { lat: 40.845, lng: 14.273 }],
  },
]

const fleetZones: FleetZone[] = [
  {
    id: 'fz-1', name: 'Zona A - Centro',
    boundary: [{ lat: 40.849, lng: 14.263 }, { lat: 40.854, lng: 14.263 }, { lat: 40.854, lng: 14.272 }, { lat: 40.849, lng: 14.272 }],
    vehicleCount: 3, targetCount: 5,
  },
]

async function seed() {
  console.log('Seeding database...')
  for (const u of users) await userRepo.save(u)
  console.log(`  ${users.length} users`)
  for (const v of vehicles) await vehicleRepo.save(v)
  console.log(`  ${vehicles.length} vehicles`)
  for (const z of zones) await zoneRepo.save(z)
  console.log(`  ${zones.length} zones`)
  for (const fz of fleetZones) await fleetZoneRepo.save(fz)
  console.log(`  ${fleetZones.length} fleet zones`)
  console.log('Done.')
}

seed().catch(err => { console.error(err); process.exit(1) })
