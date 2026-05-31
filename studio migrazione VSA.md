# SHARING VSA

Documento di riferimento per l'architettura **Vertical Slice Architecture (VSA)** della piattaforma di vehicle sharing.
Una *slice* è un'unità autonoma che attraversa tutti gli strati dell'applicazione (UI → Business Logic → Data) per una singola funzionalità. Ogni slice dipende solo da **contratti** (interfacce), mai dall'implementazione concreta e mai da un'altra slice.

La piattaforma serve tre tipologie di utente:
- **Cliente** (`Customer`) — prenota, usa e paga i mezzi.
- **Operatore** (`Operator`) — manutiene la flotta, gestisce ticket e anomalie.
- **Amministrazione Pubblica** (`PublicAdministrationUser`) — governa zone, regole urbane e consulta report.

---

## 1. Architettura fisica e principi VSA

> Questa sezione è il ponte tra l'organizzazione logica (le slice) e l'organizzazione fisica (il monorepo). Serve a derivare correttamente il **component diagram**, il **package diagram** e il **deployment diagram**.

### 1.1 Topologia client-server (monorepo Turborepo)

```
vsa/
├─ apps/
│  ├─ api/                 # Backend (Node + TypeScript) — lato server di ogni slice
│  │  ├─ src/
│  │  │  ├─ slices/        # una cartella per slice (endpoint + handler + data access locale)
│  │  │  │  ├─ NearbyVehicles/
│  │  │  │  ├─ BookVehicle/
│  │  │  │  └─ ...
│  │  │  ├─ adapters/      # implementazioni concrete dei contratti (SQLite, Pagamento, ...)
│  │  │  └─ composition/   # composition root: Dependency Injection / wiring
│  │  └─ ...
│  └─ web/                 # Frontend React — lato client di ogni slice
│     └─ src/
│        └─ slices/        # una cartella per slice (UI + hook che chiama l'API)
│           ├─ NearbyVehicles/
│           ├─ BookVehicle/
│           └─ ...
├─ packages/
│  └─ contracts/           # SHARED KERNEL: modelli di dominio, enum, value object, interfacce
└─ turbo.json
```

### 1.2 Dove vive una slice (regola chiave per l'UML)

Una slice è **una sola funzionalità verticale** che fisicamente si distribuisce su due app:

```
[ apps/web/src/slices/BookVehicle ]  →(HTTP/JSON)→  [ apps/api/src/slices/BookVehicle ]  →  [ SQLite ]
        UI + API client                                  endpoint + handler + data access
```

La chiamata di rete (HTTP) è una **cucitura interna alla slice**, non un confine tra slice diverse. Entrambi i lati condividono *solo* i tipi di `packages/contracts`. Nel diagramma dei componenti questo si rappresenta con due componenti omonimi (uno in `web`, uno in `api`) collegati da un'interfaccia REST e dipendenti entrambi dal package `contracts`.

### 1.3 Regole di dipendenza (invarianti dell'architettura)

1. Una slice **non importa mai** da un'altra slice (né in `web` né in `api`).
2. `apps/web` e `apps/api` dipendono **solo** da `packages/contracts` per i tipi condivisi.
3. Le **implementazioni concrete** (adapter) vivono in `apps/api/src/adapters` e implementano le interfacce di `contracts`.
4. Il **wiring** (quale implementazione concreta soddisfa quale interfaccia) avviene in un unico *composition root* tramite Dependency Injection.
5. Slice in relazione produttore/consumatore (es. `BookVehicle` produce una `Booking`, `UnlockVehicle` la consuma) **comunicano solo attraverso repository/servizi condivisi**, mai per import diretto.

### 1.4 Come si implementa uno slice
Nella architettura **sono 3 file per slice sul lato API**, con 
#### I 3 file e il loro ruolo

```
apps/api/src/slices/BookVehicle/
├── BookVehicle.router.ts    ← strato HTTP
├── BookVehicle.handler.ts   ← logica applicativa (use case)
└── BookVehicle.types.ts     ← tipi locali input/output

```

**`BookVehicle.types.ts`** Contiene solo la forma della richiesta e della risposta per quella slice. Non importa niente dall'interno dello slice; importa solo da `packages/contracts`.

```typescript
// BookVehicle.types.ts
import type { Booking } from '@vsa/contracts'

export interface BookVehicleRequest {
  vehicleId: string
  userId: string
}

export interface BookVehicleResponse {
  booking: Booking
}

```

**`BookVehicle.handler.ts`** Contiene la logica del caso d'uso. Riceve le dipendenze (repository/servizi) via parametri o costruttore — **non le importa direttamente**, li accetta già wirati dall'esterno. Importa solo i propri `types` e i contratti di `packages/contracts`.

```typescript
// BookVehicle.handler.ts
import type { IVehicleRepository, IBookingRepository, IUserRepository } from '@vsa/contracts'
import type { BookVehicleRequest, BookVehicleResponse } from './BookVehicle.types'

export function makeBookVehicleHandler(deps: {
  vehicleRepo: IVehicleRepository
  bookingRepo: IBookingRepository
  userRepo: IUserRepository
}) {
  return async function bookVehicleHandler(
    req: BookVehicleRequest
  ): Promise<BookVehicleResponse> {
    const vehicle = await deps.vehicleRepo.findById(req.vehicleId)
    // ... validazioni, state transitions, save
    const booking = { id: '...', userId: req.userId, vehicleId: req.vehicleId, ... }
    await deps.bookingRepo.save(booking)
    return { booking }
  }
}

```

**`BookVehicle.router.ts`** Si occupa solo di HTTP: parsing del body, validazione dell'input, chiamata all'handler, gestione della risposta/errori. Importa `handler` e `types`. Esporta un `Router` (o un `route` se usi Hono/Fastify).

```typescript
// BookVehicle.router.ts
import { Router } from 'express'
import { makeBookVehicleHandler } from './BookVehicle.handler'
import type { BookVehicleRequest } from './BookVehicle.types'
import { container } from '../../composition/container'  // ← DI wiring

const router = Router()
const handler = makeBookVehicleHandler(container.bookVehicle)

router.post('/bookings', async (req, res) => {
  const input: BookVehicleRequest = { vehicleId: req.body.vehicleId, userId: req.user.id }
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as bookVehicleRouter }

```

----------

#### Il flusso di dipendenze (chi importa chi)

```
types.ts
  ↑
handler.ts   ←  interfaces (da packages/contracts, iniettate a runtime)
  ↑
router.ts    ←  composition root (fa il wiring delle implementazioni concrete)

```

Le frecce indicano "importa da". La regola chiave: **il flusso è unidirezionale verso il basso**. Nessuna dipendenza circolare, nessun file che importa da un altro slice.

Il "data access locale" che immaginavi non è un file separato dentro la slice: è il handler che **chiama** il repository tramite interfaccia. Il repository concreto (`SqliteBookingRepository`) vive in `apps/api/src/adapters/` e viene iniettato dall'esterno. Il motivo: se mettessi il `SqliteBookingRepository` dentro la slice, quella slice dipenderebbe da SQLite, non più dal contratto — violeresti il punto 3 della regola di dipendenza.

----------

#### Convention dei nomi

Schema fisso: `<SliceName>.<ruolo>.ts`, tutto in PascalCase per il nome, camelCase per il ruolo.

```
apps/api/src/slices/BookVehicle/
├── BookVehicle.types.tsx     ← tipi locali (input/output/DTOs)
├── BookVehicle.handler.ts    ← logica del caso d'uso
├── BookVehicle.test.ts       ← test della slice (opzionale ma consigliato)
└── BookVehicle.router.ts     ← strato HTTP (endpoint)

```

E il lato `apps/web` della stessa slice segue la stessa convenzione:

```
apps/web/src/slices/BookVehicle/
├── BookVehicle.page.tsx     ← componente React (UI)
├── BookVehicle.hook.ts      ← logica + chiamata API (useBookVehicle)
└── BookVehicle.types.ts     ← tipi locali (condivide quelli di contracts)

```

----------

#### Come si registrano i router nell'app

Il `composition root` in `apps/api/src/composition/container.ts` fa il wiring una volta sola e poi il server centrale li aggrega:

```typescript
// apps/api/src/app.ts
import { bookVehicleRouter }   from './slices/BookVehicle/BookVehicle.router'
import { nearbyVehiclesRouter } from './slices/NearbyVehicles/NearbyVehicles.router'
// ... tutti i router

app.use('/api', bookVehicleRouter)
app.use('/api', nearbyVehiclesRouter)

```

Ogni slice è auto-contenuta: aggiungi una nuova cartella, esporti il router, lo registri qui — e non tocchi nient'altro. Questo è il senso pratico della VSA.


### 1.5 Persistenza

Il database è **SQLite** (singolo file, ideale per un progetto d'esame). Gli adapter concreti sono SQLite-backed e implementano le interfacce repository, ad esempio `SqliteUserRepository`, `SqliteVehicleRepository`, `SqliteBookingRepository`, `SqliteRideRepository`, `SqliteZoneRepository`, `SqliteFleetZoneRepository`. La scelta di SQLite **non cambia nessuna interfaccia**: è l'intero senso del pattern repository.

---

## 2. Modelli del dominio

I modelli sono classificati in tre categorie. La distinzione è fondamentale per il class diagram (le entità hanno identità e quindi associazioni; i value object sono parti componenti; i DTO sono risultati di slice e non vengono persistiti).

### 2.1 Entità di dominio (hanno identità — `id`)

| Modello | Tipo | Ruolo nel dominio |
|---|---|---|
| `User` | Classe astratta | Radice comune dei profili autenticati |
| `Customer` | Classe concreta | Utente finale che prenota, usa e paga i mezzi |
| `Operator` | Classe concreta | Gestisce flotta, ticket, manutenzione e anomalie |
| `PublicAdministrationUser` | Classe concreta | Consulta report e governa zone/regole urbane |
| `Vehicle` | Classe astratta | Radice comune dei mezzi condivisi |
| `Bicycle` | Classe concreta | Veicolo leggero, spesso senza patente |
| `Scooter` | Classe concreta | Mezzo elettrico urbano con vincoli di batteria e sicurezza |
| `Car` | Classe concreta | Veicolo con vincoli ulteriori (patente, età minima) |
| `Ride` | Entità (data model) | Sessione d'uso del mezzo |
| `Booking` | Entità (data model) | Prenotazione prima dell'avvio della corsa |
| `SupportTicket` | Entità (data model) | Richiesta di assistenza aperta dall'utente |
| `VehicleConditionReport` | Entità (data model) | Segnalazione di danno o malfunzionamento |
| `ZoneRule` | Entità (data model) | Regola geografica che influenza transito e parcheggio |
| `Promotion` | Entità (data model) | Sconto o incentivo applicabile |
| `PaymentMethod` | Entità (composta in `Customer`) | Metodo di pagamento del cliente |
| `ParkingBonusRule` | Entità (data model) | Regola di bonus per parcheggio virtuoso (OP.08) |
| `FleetZone` | Entità (data model) | Zona operativa con soglie di disponibilità |
| `MobilityReport` | Entità (data model) | Report aggregato di mobilità urbana |

### 2.2 Value Object e tipi di supporto (senza identità — parti di un'entità)

| Tipo | Appartiene a | Note |
|---|---|---|
| `Coordinates` | ovunque | Punto geografico (lat/lng) |
| `GeoPoint` | storico GPS | `Coordinates` + timestamp |
| `Money` | pricing/billing | Importo + valuta |
| `TimeRange` | report/regole | Intervallo temporale |
| `VehicleFeatures` | `Vehicle` (composizione) | Dotazioni del mezzo |
| `VehicleSpecs` | `Vehicle` (composizione) | Specifiche tecniche |
| `PricingPlan` | `Vehicle` (composizione) | Tariffazione del mezzo |
| `BatteryInfo` | `Vehicle` (composizione) | Stato batteria |
| `VehiclePositionSnapshot` | tracking | Snapshot posizione+stato |

### 2.3 DTO / risultati di slice (non persistiti)

| Tipo | Prodotto da | Note |
|---|---|---|
| `CostEstimate` | `EstimateRideCost`, `ApplyPromotion` | Stima di costo |
| `ParkingValidationResult` | `EndRide`, `VerifyParkingPosition` | Esito validazione parcheggio |
| `SuggestedVehicle` | `SuggestBestVehicle` | Mezzo consigliato + punteggio |
| `WalkEstimate` | `EstimateWalkTime` | Tempo/distanza a piedi |
| `RouteEstimate` | `SuggestBestVehicle` | Tragitto con vincoli di zona |

> **Filosofia di modellazione (da rispettare nel class diagram).** Le gerarchie `User` e `Vehicle` sono **ricche** (classi astratte con metodi polimorfici) perché il dominio richiede comportamenti specializzati per tipo (es. un'auto richiede patente, uno scooter ha una batteria minima). Tutte le altre entità sono **data-centric**: lo stato vive nell'entità, il comportamento vive nelle slice e nei servizi. Questa scelta è coerente con la VSA (handler sottili e modelli condivisi) ed è quella da riportare nel diagramma.

---

## 3. Relazioni e molteplicità (per il class diagram)

Nel modello le associazioni sono espresse tramite campi-identificatore (`userId`, `vehicleId`, …). Questa tabella le traduce in associazioni UML esplicite, così il class diagram è derivabile senza ambiguità.

### 3.1 Generalizzazioni (ereditarietà)

| Sottoclasse | Superclasse |
|---|---|
| `Customer`, `Operator`, `PublicAdministrationUser` | `User` |
| `Bicycle`, `Scooter`, `Car` | `Vehicle` |

### 3.2 Associazioni e composizioni

| Da | Molteplicità | A | Tipo | Campo sorgente |
|---|---|---|---|---|
| `Customer` | 1 ◆— 0..* | `PaymentMethod` | composizione | `savedPaymentMethods` |
| `Customer` | 0..1 —— 0..1 | `Booking` | associazione | `currentBookingId` |
| `Customer` | 0..1 —— 0..1 | `Ride` | associazione | `currentRideId` |
| `Customer` | 1 —— 0..* | `Promotion` | associazione | `activePromotionIds` |
| `Booking` | 0..* —— 1 | `Customer` | associazione | `userId` |
| `Booking` | 0..* —— 1 | `Vehicle` | associazione | `vehicleId` |
| `Ride` | 0..* —— 1 | `Customer` | associazione | `userId` |
| `Ride` | 0..* —— 1 | `Vehicle` | associazione | `vehicleId` |
| `Ride` | 0..1 —— 0..1 | `Promotion` | associazione | `appliedPromotionId` |
| `Vehicle` | 1 ◆— 1 | `PricingPlan` | composizione | `pricingPlan` |
| `Vehicle` | 1 ◆— 1 | `VehicleSpecs` | composizione | `specs` |
| `Vehicle` | 1 ◆— 1 | `VehicleFeatures` | composizione | `features` |
| `Vehicle` | 1 ◆— 0..1 | `BatteryInfo` | composizione | `batteryInfo` |
| `Vehicle` | 0..* —— 0..1 | `FleetZone` | associazione | `zoneId` |
| `SupportTicket` | 0..* —— 1 | `User` | associazione | `userId` |
| `SupportTicket` | 0..* —— 0..1 | `Operator` | associazione | `assignedOperatorId` |
| `SupportTicket` | 0..1 —— 0..1 | `Ride` | associazione | `relatedRideId` |
| `SupportTicket` | 0..1 —— 0..1 | `Vehicle` | associazione | `relatedVehicleId` |
| `VehicleConditionReport` | 0..* —— 1 | `Vehicle` | associazione | `vehicleId` |
| `VehicleConditionReport` | 0..* —— 1 | `User` | associazione | `reporterUserId` |
| `ZoneRule` | 1 ◆— 3..* | `Coordinates` | composizione | `polygon` |
| `MobilityReport` | 0..* —— 1 | `PublicAdministrationUser` | associazione | `generatedByAdminId` |
| `ParkingBonusRule` | 0..* —— 1 | `Operator` | associazione | `configuredByOperatorId` |
| `ParkingBonusRule` | 0..* —— 0..1 | `FleetZone` | associazione | `zoneId` |
| `Operator` | 1 —— 0..* | `Vehicle` | associazione | `managedVehicleIds` |
| `Operator` | 1 —— 0..* | `FleetZone` | associazione | `assignedZones` |
| `PublicAdministrationUser` | 1 —— 0..* | `ZoneRule` | associazione | `managedZoneIds` |

---

## 4. Mappa completa: slice → modelli → interfacce

> Questa è la tabella più importante per garantire la coerenza della vertical slice. Copre **tutte e 32 le slice** (la versione precedente ne copriva solo 16). Ogni riga indica i modelli toccati e i contratti da cui la slice dipende: nessuna slice dipende da implementazioni concrete o da altre slice.

| ID | Slice | Modelli principali | Interfacce (contratti) |
|---|---|---|---|
| UT.01 | `NearbyVehicles` | `Customer`, `Vehicle`, `FleetZone`, `Coordinates` | `IVehicleRepository`, `IGpsTrackingService`, `IFleetZoneRepository` |
| UT.02 | `BookVehicle` | `Customer`, `Vehicle`, `Booking` | `IUserRepository`, `IVehicleRepository`, `IBookingRepository` |
| UT.03 | `EstimateRideCost` | `Customer`, `Vehicle`, `CostEstimate`, `Promotion` | `IVehicleRepository`, `IPricingService`, `IPromotionService` |
| UT.04 | `EndRide` | `Ride`, `Vehicle`, `Customer`, `ParkingValidationResult` | `IRideRepository`, `IVehicleRepository`, `IZoneValidator`, `IBillingService`, `IIncentiveService`, `INotificationSender` |
| UT.05 | `RideSummary` | `Ride`, `Vehicle` | `IRideRepository`, `IVehicleRepository` |
| UT.06 | `VehicleDetails` | `Vehicle`, `PricingPlan`, `VehicleSpecs`, `VehicleFeatures` | `IVehicleRepository` |
| UT.07 | `EstimateWalkTime` | `Vehicle`, `WalkEstimate`, `Coordinates` | `IVehicleRepository`, `IRoutingService` |
| UT.08 | `SuggestBestVehicle` | `Customer`, `Vehicle`, `SuggestedVehicle`, `RouteEstimate` | `IVehicleRepository`, `IRoutingService`, `IZoneValidator`, `IPricingService` |
| UT.09 | `ApplyPromotion` | `Customer`, `Promotion`, `CostEstimate` | `IPromotionService` |
| UT.10 | `OpenSupportTicket` | `Customer`, `SupportTicket` | `ISupportService` |
| UT.11 | `ReportDamagedVehicle` | `Customer`, `VehicleConditionReport`, `Vehicle` | `IMaintenanceService`, `INotificationSender` |
| UT.12 | `VehicleBatteryStatus` | `Vehicle`, `BatteryInfo` | `IVehicleRepository` |
| UT.13 | `UnlockVehicle` | `Customer`, `Vehicle`, `Booking`, `Ride` | `IUnlockService`, `IBookingRepository`, `IRideRepository`, `IVehicleRepository` |
| UT.14 | `UnlockMethod` | `Customer`, `Vehicle` | `IUnlockService`, `IVehicleRepository` |
| UT.15 | `ManagePaymentMethod` | `Customer`, `PaymentMethod` | `IUserRepository`, `IBillingService` |
| UT.16 | `PauseRide` | `Ride`, `Vehicle` | `IRideRepository`, `IVehicleRepository` |
| AP.01 | `UsageFrequencyReport` | `PublicAdministrationUser`, `MobilityReport` | `IReportingService` |
| AP.02 | `MobilityPeriodicReport` | `PublicAdministrationUser`, `MobilityReport` | `IReportingService` |
| AP.03 | `MarkUrbanWarningZone` | `PublicAdministrationUser`, `ZoneRule` | `IZoneRepository`, `INotificationSender` |
| AP.04 | `HighDensityZoneMap` | `PublicAdministrationUser`, `MobilityReport`, `Coordinates` | `IReportingService` |
| AP.05 | `DefineSensitiveZone` | `PublicAdministrationUser`, `ZoneRule` | `IZoneRepository`, `IZoneValidator` |
| OP.01 | `FleetDistributionMap` | `Operator`, `Vehicle`, `FleetZone`, `Coordinates` | `IVehicleRepository`, `IGpsTrackingService`, `IFleetZoneRepository` |
| OP.02 | `LowAvailabilityAlert` | `Operator`, `FleetZone` | `IFleetZoneRepository`, `INotificationSender` |
| OP.03 | `ReceiveMalfunctionReport` | `Operator`, `VehicleConditionReport`, `Vehicle` | `IMaintenanceService` |
| OP.04 | `VerifyParkingPosition` | `Operator`, `Vehicle`, `ParkingValidationResult`, `ZoneRule` | `IZoneValidator`, `IGpsTrackingService`, `IVehicleRepository` |
| OP.05 | `MaintenanceQueue` | `Operator`, `Vehicle`, `VehicleConditionReport` | `IMaintenanceService` |
| OP.06 | `VehicleGPSHistory` | `Operator`, `Vehicle`, `GeoPoint` | `IGpsTrackingService` |
| OP.07 | `ManageSupportTickets` | `Operator`, `SupportTicket` | `ISupportService`, `IUserRepository` |
| OP.08 | `ConfigureParkingBonus` | `Operator`, `ParkingBonusRule`, `FleetZone` | `IIncentiveService` |
| OP.09 | `SuspendUserAccount` | `Operator`, `User` (`Customer`) | `IAuthService`, `IUserRepository` |
| OP.10 | `RemoteLockVehicle` | `Operator`, `Vehicle` | `IUnlockService`, `IVehicleRepository`, `IZoneValidator`, `INotificationSender` |
| OP.11 | `ExpiredBookingsMonitor` | `Operator`, `Booking` | `IBookingRepository` |

---

## 5. Implementazione di riferimento

### 5.1 Enum e tipi di supporto

```typescript
// =========================
// ENUM
// =========================

enum UserRole {
  CUSTOMER,
  OPERATOR,
  PUBLIC_ADMIN
}

enum UserStatus {
  ACTIVE,
  SUSPENDED,
  BLOCKED,
  PENDING_VERIFICATION
}

enum VehicleType {
  BICYCLE,
  SCOOTER,
  CAR
}

enum VehicleStatus {
  AVAILABLE,
  RESERVED,
  IN_USE,
  PAUSED,
  CHARGING,
  MAINTENANCE,
  OUT_OF_SERVICE,
  LOCKED
}

enum RideStatus {
  CREATED,
  ACTIVE,
  PAUSED,
  COMPLETED,
  CANCELLED
}

enum BookingStatus {
  ACTIVE,
  EXPIRED,
  CANCELLED,
  CONVERTED_TO_RIDE
}

enum PaymentMethodType {
  CREDIT_CARD,
  DEBIT_CARD,
  PAYPAL,
  WALLET
}

enum SupportTicketStatus {
  OPEN,
  IN_PROGRESS,
  RESOLVED,
  CLOSED
}

enum MaintenanceSeverity {
  LOW,
  MEDIUM,
  HIGH,
  CRITICAL
}

enum ZoneType {
  PARKING,
  NO_PARKING,
  NO_TRANSIT,
  ZTL,
  PEDESTRIAN,
  SCHOOL,
  HOSPITAL,
  MAINTENANCE,   // zona di manutenzione urbana (AP.03)
  CONSTRUCTION   // cantiere temporaneo (AP.03)
}

enum UnlockMethodType {
  QR,
  NFC,
  PIN,
  BLE
}

// =========================
// VALUE OBJECT / TIPI DI SUPPORTO
// =========================

interface Coordinates {
  latitude: number
  longitude: number
}

interface GeoPoint {
  coordinates: Coordinates
  timestamp: Date
}

interface Money {
  amount: number
  currency: string
}

interface TimeRange {
  startAt: Date
  endAt?: Date
}

interface VehicleFeatures {
  hasHelmet?: boolean
  hasBasket?: boolean
  hasChildSeat?: boolean
  hasAirConditioning?: boolean
  hasParkingSensors?: boolean
  supportsNfcUnlock?: boolean
  supportsQrUnlock?: boolean
  supportsPinUnlock?: boolean
}

interface VehicleSpecs {
  brand: string
  model: string
  maxRangeKm: number
  topSpeedKmH: number
  seats?: number
  cargoCapacityLiters?: number
}

interface PricingPlan {
  unlockFee: Money
  pricePerMinute: Money
  pausePricePerMinute?: Money
  reservationFeePerMinute?: Money
}

interface BatteryInfo {
  levelPercentage: number
  estimatedRangeKm: number
  charging: boolean
  lastUpdatedAt: Date
}

interface VehiclePositionSnapshot {
  vehicleId: string
  position: Coordinates
  recordedAt: Date
  status: VehicleStatus
}
```

### 5.2 Entità di dominio

```typescript
// =========================
// MODELLO ASTRATTO UTENTE
// =========================

abstract class User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date

  abstract canStartRide(): boolean
  abstract canManageFleet(): boolean
  abstract canDefineZones(): boolean
  abstract getVisibleSlices(): string[]
}

class Customer extends User {
  defaultPaymentMethodId?: string
  savedPaymentMethods: PaymentMethod[]
  activePromotionIds: string[]
  currentBookingId?: string
  currentRideId?: string
  drivingLicenseNumber?: string
  preferredVehicleTypes: VehicleType[]

  canStartRide(): boolean
  canManageFleet(): boolean
  canDefineZones(): boolean
  getVisibleSlices(): string[]
}

class Operator extends User {
  operatorCode: string
  assignedZones: string[]
  managedVehicleIds: string[]
  openTicketIds: string[]
  shiftStartAt?: Date
  shiftEndAt?: Date

  canStartRide(): boolean
  canManageFleet(): boolean
  canDefineZones(): boolean
  getVisibleSlices(): string[]
}

class PublicAdministrationUser extends User {
  administrationCode: string
  departmentName: string
  managedZoneIds: string[]
  reportAccessScopes: string[]

  canStartRide(): boolean
  canManageFleet(): boolean
  canDefineZones(): boolean
  getVisibleSlices(): string[]
}

// =========================
// MODELLO ASTRATTO VEICOLO
// =========================

abstract class Vehicle {
  id: string
  plateOrCode: string
  type: VehicleType
  status: VehicleStatus
  currentPosition: Coordinates
  batteryInfo?: BatteryInfo
  pricingPlan: PricingPlan
  specs: VehicleSpecs
  features: VehicleFeatures
  zoneId?: string
  lastMaintenanceAt?: Date
  nextMaintenanceAt?: Date
  lastRideId?: string
  createdAt: Date
  updatedAt: Date

  abstract canBeReserved(): boolean
  abstract canBeUnlocked(): boolean
  abstract canBePaused(): boolean
  abstract supportsDestination(destination: Coordinates): boolean
  abstract getRequiredUnlockMethods(): UnlockMethodType[]
}

class Bicycle extends Vehicle {
  hasMechanicalLock: boolean
  hasElectricAssist: boolean

  canBeReserved(): boolean
  canBeUnlocked(): boolean
  canBePaused(): boolean
  supportsDestination(destination: Coordinates): boolean
  getRequiredUnlockMethods(): UnlockMethodType[]
}

class Scooter extends Vehicle {
  helmetRequired: boolean
  minimumBatteryToStart: number

  canBeReserved(): boolean
  canBeUnlocked(): boolean
  canBePaused(): boolean
  supportsDestination(destination: Coordinates): boolean
  getRequiredUnlockMethods(): UnlockMethodType[]
}

class Car extends Vehicle {
  seats: number
  transmission: 'MANUAL' | 'AUTOMATIC'
  requiresDrivingLicense: boolean
  minimumDriverAge?: number

  canBeReserved(): boolean
  canBeUnlocked(): boolean
  canBePaused(): boolean
  supportsDestination(destination: Coordinates): boolean
  getRequiredUnlockMethods(): UnlockMethodType[]
}

// =========================
// ALTRE ENTITÀ DI DOMINIO
// =========================

interface PaymentMethod {
  id: string
  type: PaymentMethodType
  maskedLabel: string
  provider: string
  expiresAt?: Date
  isDefault: boolean
}

interface Promotion {
  id: string
  code: string
  title: string
  description: string
  validFrom: Date
  validUntil: Date
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_UNLOCK'
  discountValue: number
  isActive: boolean
}

interface ZoneRule {
  id: string
  type: ZoneType
  name: string
  active: boolean
  polygon: Coordinates[]
  maxSpeedKmH?: number
  parkingAllowed?: boolean
  transitAllowed?: boolean
  validFrom?: Date   // per zone temporanee (cantieri AP.03)
  validUntil?: Date  // se assente la zona è permanente (zone sensibili AP.05)
}

interface VehicleConditionReport {
  id: string
  vehicleId: string
  reporterUserId: string
  description: string
  severity: MaintenanceSeverity
  createdAt: Date
  images?: string[]
}

interface SupportTicket {
  id: string
  userId: string
  subject: string
  description: string
  status: SupportTicketStatus
  relatedRideId?: string
  relatedVehicleId?: string
  openedAt: Date
  closedAt?: Date
  assignedOperatorId?: string
}

interface Booking {
  id: string
  userId: string
  vehicleId: string
  reservedAt: Date
  expiresAt: Date
  status: BookingStatus
}

interface Ride {
  id: string
  userId: string
  vehicleId: string
  status: RideStatus
  startedAt: Date
  endedAt?: Date
  pausedAt?: Date
  startPosition: Coordinates
  endPosition?: Coordinates
  traveledPath?: GeoPoint[]
  estimatedCost?: Money
  finalCost?: Money
  appliedPromotionId?: string
}

interface ParkingBonusRule {
  id: string
  name: string
  active: boolean
  zoneId?: string                 // FleetZone/zona a cui si applica (se assente: globale)
  bonusAmount: Money
  description: string             // condizione leggibile (es. "parcheggio in zona consentita")
  configuredByOperatorId: string
  validFrom: Date
  validUntil?: Date
}

interface FleetZone {
  id: string
  name: string
  center: Coordinates
  minimumAvailableVehicles: number
  currentAvailableVehicles: number
}

interface MobilityReport {
  id: string
  period: TimeRange
  generatedAt: Date
  generatedByAdminId: string
  vehicleUsageByType: Record<VehicleType, number>
  hotZones: Coordinates[]
}

// =========================
// DTO / RISULTATI DI SLICE
// =========================

interface CostEstimate {
  vehicleId: string
  estimatedDurationMinutes: number
  estimatedDistanceKm?: number
  baseCost: Money
  promotionDiscount?: Money
  totalEstimatedCost: Money
}

interface ParkingValidationResult {
  vehicleId: string
  isAllowed: boolean
  violatedZoneRuleIds: string[]
  suggestedPenalty?: Money
  suggestedBonus?: Money
}

interface SuggestedVehicle {
  vehicleId: string
  score: number
  reason: string
  estimatedArrivalMinutes: number
  estimatedRideCost: Money
}

interface WalkEstimate {
  durationMinutes: number
  distanceKm: number
}

interface RouteEstimate {
  from: Coordinates
  to: Coordinates
  durationMinutes: number
  distanceKm: number
  crossesRestrictedZone: boolean
  violatedZoneRuleIds: string[]
}
```

### 5.3 Contratti (interfacce)

```typescript
// ---- Repository (accesso ai dati di una singola aggregata) ----

interface IUserRepository {
  findById(userId: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<void>
  update(user: User): Promise<void>
}

interface IVehicleRepository {
  findById(vehicleId: string): Promise<Vehicle | null>
  findNearby(position: Coordinates, radiusMeters: number): Promise<Vehicle[]>
  findAvailableByZone(zoneId: string): Promise<Vehicle[]>
  findAll(): Promise<Vehicle[]>
  save(vehicle: Vehicle): Promise<void>
  update(vehicle: Vehicle): Promise<void>
}

interface IBookingRepository {
  findById(bookingId: string): Promise<Booking | null>
  findActiveByUser(userId: string): Promise<Booking | null>
  findExpiredNotStarted(): Promise<Booking[]>
  save(booking: Booking): Promise<void>
  update(booking: Booking): Promise<void>
}

interface IRideRepository {
  findById(rideId: string): Promise<Ride | null>
  findActiveByUser(userId: string): Promise<Ride | null>
  save(ride: Ride): Promise<void>
  update(ride: Ride): Promise<void>
}

interface IZoneRepository {
  findById(zoneId: string): Promise<ZoneRule | null>
  findActiveByPosition(position: Coordinates): Promise<ZoneRule[]>
  findByType(type: ZoneType): Promise<ZoneRule[]>
  save(zone: ZoneRule): Promise<void>
  update(zone: ZoneRule): Promise<void>
  deactivate(zoneId: string): Promise<void>
}

interface IFleetZoneRepository {
  findAll(): Promise<FleetZone[]>
  findById(zoneId: string): Promise<FleetZone | null>
  findBelowThreshold(): Promise<FleetZone[]>
  updateAvailability(zoneId: string, currentAvailableVehicles: number): Promise<void>
}

// ---- Servizi applicativi / di dominio ----

interface IAuthService {
  authenticate(email: string, password: string): Promise<User>
  authorize(user: User, requiredRole: UserRole): boolean
  suspendUser(userId: string, reason: string): Promise<void>
  blockUser(userId: string, reason: string): Promise<void>
}

interface IPricingService {
  estimateRideCost(user: Customer, vehicle: Vehicle, destination?: Coordinates): Promise<CostEstimate>
  calculateFinalCost(ride: Ride, vehicle: Vehicle, promotion?: Promotion): Promise<Money>
}

interface IBillingService {
  chargeCustomer(customer: Customer, amount: Money, paymentMethod?: PaymentMethod): Promise<void>
  refundCustomer(customer: Customer, amount: Money): Promise<void>
  validatePaymentMethod(paymentMethod: PaymentMethod): Promise<boolean>
}

interface IPromotionService {
  getAvailablePromotions(customer: Customer): Promise<Promotion[]>
  applyPromotion(customer: Customer, estimate: CostEstimate, promotionCode: string): Promise<CostEstimate>
}

interface IIncentiveService {
  configureParkingBonus(rule: ParkingBonusRule): Promise<void>
  getActiveParkingBonusRules(): Promise<ParkingBonusRule[]>
  evaluateParkingBonus(ride: Ride, parkingResult: ParkingValidationResult): Promise<Money | null>
}

interface INotificationSender {
  notifyUser(userId: string, message: string): Promise<void>
  notifyOperator(operatorId: string, message: string): Promise<void>
  notifyZoneAlert(zoneId: string, message: string): Promise<void>
}

interface IUnlockService {
  unlock(vehicle: Vehicle, method: UnlockMethodType, user: Customer): Promise<boolean>
  lock(vehicle: Vehicle): Promise<boolean>
  getSupportedMethods(vehicle: Vehicle): UnlockMethodType[]
}

interface IZoneValidator {
  validateDestination(vehicle: Vehicle, destination: Coordinates): Promise<boolean>
  validateParking(vehicle: Vehicle, position: Coordinates): Promise<ParkingValidationResult>
  getActiveRulesByPosition(position: Coordinates): Promise<ZoneRule[]>
}

interface IRoutingService {
  estimateWalkingTime(from: Coordinates, to: Coordinates): Promise<WalkEstimate>
  estimateRoute(vehicle: Vehicle, from: Coordinates, to: Coordinates): Promise<RouteEstimate>
}

interface IGpsTrackingService {
  getCurrentPosition(vehicleId: string): Promise<Coordinates>
  getPositionHistory(vehicleId: string): Promise<GeoPoint[]>
  savePositionSnapshot(snapshot: VehiclePositionSnapshot): Promise<void>
}

interface IMaintenanceService {
  openReport(report: VehicleConditionReport): Promise<void>
  getVehiclesNeedingMaintenance(): Promise<Vehicle[]>
  getReports(): Promise<VehicleConditionReport[]>
  markVehicleOutOfService(vehicleId: string, reason: string): Promise<void>
}

interface ISupportService {
  openTicket(ticket: SupportTicket): Promise<void>
  assignTicket(ticketId: string, operatorId: string): Promise<void>
  closeTicket(ticketId: string): Promise<void>
  getOpenTickets(): Promise<SupportTicket[]>
}

interface IReportingService {
  generateMobilityReport(period: TimeRange): Promise<MobilityReport>
  getUsageByVehicleType(period: TimeRange): Promise<Record<VehicleType, number>>
  getHighDensityZones(period: TimeRange): Promise<Coordinates[]>
}
```

---

## 6. Catalogo delle slice

### 6.1 Slice — Utente (Cliente)

| ID | Nome | Descrizione |
|---|---|---|
| UT.01 | **NearbyVehicles** | Recupera e mostra i veicoli disponibili nelle vicinanze dell'utente tramite geolocalizzazione |
| UT.02 | **BookVehicle** | Gestisce la prenotazione di un veicolo specifico, marcandolo come riservato per l'utente |
| UT.03 | **EstimateRideCost** | Calcola e mostra il costo stimato di una corsa in base a destinazione, veicolo e tariffa attiva |
| UT.04 | **EndRide** | Termina la corsa attiva, registra la posizione finale, valida il parcheggio, calcola il costo reale, applica eventuale bonus e avvia l'addebito |
| UT.05 | **RideSummary** | Recupera e mostra il riepilogo dettagliato di una corsa conclusa (durata, costo, percorso) |
| UT.06 | **VehicleDetails** | Espone le caratteristiche complete di un veicolo (tipo, autonomia, tariffe, dotazioni) |
| UT.07 | **EstimateWalkTime** | Calcola il tempo e la distanza stimati a piedi per raggiungere un veicolo selezionato |
| UT.08 | **SuggestBestVehicle** | Suggerisce il veicolo più adatto alla destinazione evitando ZTL, zone vietate e tragitti non percorribili |
| UT.09 | **ApplyPromotion** | Recupera le promozioni attive sull'account utente e le applica alla stima/corsa |
| UT.10 | **OpenSupportTicket** | Permette all'utente di aprire una richiesta di assistenza allegando descrizione e dati della sessione |
| UT.11 | **ReportDamagedVehicle** | Invia una segnalazione di danno o malfunzionamento su un veicolo, notificando l'operatore |
| UT.12 | **VehicleBatteryStatus** | Mostra il livello di carica residuo e l'autonomia stimata di un veicolo |
| UT.13 | **UnlockVehicle** | Orchestra lo sblocco del veicolo prenotato: valida la `Booking`, esegue lo sblocco, transiziona `Vehicle` da `RESERVED` a `IN_USE` e crea la `Ride` |
| UT.14 | **UnlockMethod** | Risolve e valida il metodo di sblocco disponibile per il veicolo (QR/NFC/PIN/BLE) e restituisce il flusso corretto, prima dello sblocco effettivo |
| UT.15 | **ManagePaymentMethod** | Permette all'utente di aggiungere, modificare o rimuovere metodi di pagamento nel proprio profilo |
| UT.16 | **PauseRide** | Mette in pausa temporanea la corsa attiva, applicando la tariffa di pausa |

> **Nota su UT.13 / UT.14 (potenziale sovrapposizione, risolta).** Gli user story UT.13 e UT.14 sono quasi identici nel testo. Per non violare la VSA li ho resi **complementari e indipendenti**: `UnlockMethod` *risolve e valida* quale metodo usare (legge `IUnlockService.getSupportedMethods`); `UnlockVehicle` *esegue* lo sblocco con il metodo già scelto (`IUnlockService.unlock`). La sequenza "scegli metodo → sblocca" è orchestrata **lato UI in `apps/web`**: nessuna delle due slice importa l'altra, entrambe dipendono solo da `IUnlockService`. → *Se preferite, le due si possono fondere in un'unica slice `UnlockVehicle`; vedi §9.*

### 6.2 Slice — Amministrazione Pubblica

| ID | Nome | Descrizione |
|---|---|---|
| AP.01 | **UsageFrequencyReport** | Aggrega e mostra statistiche di utilizzo per tipologia di veicolo e fascia oraria |
| AP.02 | **MobilityPeriodicReport** | Genera report periodici (settimanali/mensili) esportabili sulla mobilità urbana aggregata |
| AP.03 | **MarkUrbanWarningZone** | Segnala cantieri o zone di manutenzione (`ZoneRule` di tipo `CONSTRUCTION`/`MAINTENANCE`, temporanee) visibili agli utenti e al routing |
| AP.04 | **HighDensityZoneMap** | Visualizza una heatmap delle tratte e zone con maggior traffico di mezzi nel tempo |
| AP.05 | **DefineSensitiveZone** | Crea e gestisce zone sensibili permanenti (ZTL, aree pedonali, scuole, ospedali) con regole di accesso automatico |

### 6.3 Slice — Operatore del Servizio

| ID | Nome | Descrizione |
|---|---|---|
| OP.01 | **FleetDistributionMap** | Mostra su mappa la posizione in tempo reale di tutti i veicoli della flotta |
| OP.02 | **LowAvailabilityAlert** | Genera notifiche automatiche quando una `FleetZone` scende sotto la soglia minima di veicoli disponibili |
| OP.03 | **ReceiveMalfunctionReport** | Raccoglie e presenta all'operatore le segnalazioni di malfunzionamento ricevute dagli utenti |
| OP.04 | **VerifyParkingPosition** | Controlla che il veicolo sia stato parcheggiato in una zona valida al termine di ogni corsa |
| OP.05 | **MaintenanceQueue** | Mostra l'elenco dei veicoli in attesa o programmati per manutenzione, con priorità |
| OP.06 | **VehicleGPSHistory** | Recupera e visualizza lo storico delle posizioni GPS di un veicolo per audit o indagini |
| OP.07 | **ManageSupportTickets** | Dashboard per visualizzare, assegnare e risolvere le richieste di assistenza degli utenti |
| OP.08 | **ConfigureParkingBonus** | Configura `ParkingBonusRule` per assegnare automaticamente bonus agli utenti che parcheggiano correttamente |
| OP.09 | **SuspendUserAccount** | Sospende o blocca un account utente, impedendone l'accesso al servizio |
| OP.10 | **RemoteLockVehicle** | Invia un comando remoto per bloccare un veicolo fuori zona o segnalato come a rischio |
| OP.11 | **ExpiredBookingsMonitor** | Visualizza le prenotazioni attive che hanno superato il tempo massimo senza avvio corsa |

---

## 7. Contratti condivisi: repository vs servizi cross-cutting

I contratti si dividono in due famiglie. La distinzione conta per il **package/component diagram** (i repository sono adapter di persistenza, i servizi sono porte applicative). Tutti vivono in `packages/contracts` e vengono iniettati via DI; **nessuna slice istanzia un'implementazione concreta**.

> **Regola fondamentale:** una slice può *usare* un contratto tramite interfaccia, ma non può *importare* da un'altra slice verticale.

### 7.1 Repository (persistenza di una singola aggregata)

| Interfaccia | Aggregata | Implementazione concreta (esempio) |
|---|---|---|
| `IUserRepository` | `User` | `SqliteUserRepository` |
| `IVehicleRepository` | `Vehicle` | `SqliteVehicleRepository` |
| `IBookingRepository` | `Booking` | `SqliteBookingRepository` |
| `IRideRepository` | `Ride` | `SqliteRideRepository` |
| `IZoneRepository` | `ZoneRule` | `SqliteZoneRepository` |
| `IFleetZoneRepository` | `FleetZone` | `SqliteFleetZoneRepository` |

### 7.2 Servizi applicativi / di dominio (cross-cutting)

| Interfaccia | Ruolo | Implementazione concreta (esempio) |
|---|---|---|
| `IAuthService` | Autenticazione, ruoli, sospensione/blocco account | `JwtAuthService` |
| `IZoneValidator` | Valida transito/parcheggio rispetto alle zone | `GeoZoneValidator`, `H3ZoneValidator` |
| `IRoutingService` | Stima tempo/distanza a piedi e tragitti | `HaversineRoutingService` (MVP), `OsrmRoutingService` |
| `IPricingService` | Stima e calcolo finale del costo | `StandardPricingService` |
| `IBillingService` | Addebito, rimborso, validazione metodi di pagamento | `StripeProcessor`, `MockBillingProcessor` |
| `IPromotionService` | Promozioni applicabili e applicazione | `StandardPromotionService` |
| `IIncentiveService` | Regole e calcolo dei bonus di parcheggio (OP.08) | `StandardIncentiveService` |
| `INotificationSender` | Notifiche push/email/SMS a utenti e operatori | `FirebasePushSender`, `SmtpEmailSender` |
| `IUnlockService` | Sblocco/blocco fisico del veicolo | `BleUnlockService`, `MockUnlockService` |
| `IGpsTrackingService` | Posizione corrente e storico GPS | `GpsTrackingService` |
| `IMaintenanceService` | Segnalazioni e coda di manutenzione | `StandardMaintenanceService` |
| `ISupportService` | Ciclo di vita dei ticket di assistenza | `StandardSupportService` |
| `IReportingService` | Aggregazioni e report di mobilità | `StandardReportingService` |

---

## 8. Decisioni architetturali

- `User` e `Vehicle` sono **classi astratte**: rappresentano famiglie omogenee con stato condiviso e comportamenti polimorfici da specializzare (patente, batteria minima, metodi di sblocco supportati).
- Le altre entità sono **data model** (stato senza comportamento): la logica vive nelle slice e nei servizi. Questo tiene gli handler sottili e i modelli condivisibili tra slice senza accoppiamento.
- Le dipendenze trasversali (auth, pricing, billing, routing, zone, maintenance, reporting, incentivi, notifiche, sblocco, tracking) sono **interfacce applicative**: ogni slice dipende dal contratto, mai dall'implementazione.
- La persistenza è isolata dietro **repository per aggregata**, così SQLite è una scelta intercambiabile.
- Si evitano gerarchie profonde: una sola base astratta con poche concrete mantiene il modello leggibile.
- Le slice produttore/consumatore comunicano **solo** tramite repository/servizi condivisi (es. `BookVehicle` → `Booking` → `UnlockVehicle`; `ReportDamagedVehicle` → `VehicleConditionReport` → `ReceiveMalfunctionReport`/`MaintenanceQueue`; `OpenSupportTicket` → `SupportTicket` → `ManageSupportTickets`).

---

## 9. Punti aperti da confermare con il gruppo

1. **UT.13 / UT.14** — Tenute come due slice complementari (`UnlockVehicle` + `UnlockMethod`) per mantenere il mapping 1:1 con gli user story. In alternativa si fondono in un'unica `UnlockVehicle` con uno step "scegli metodo" interno. 
2. **`IIncentiveService` + `ParkingBonusRule`** — Promossi da "estensione futura" a core perché OP.08 è uno user story richiesto. VALUTARE se il bonus va applicato dentro `EndRide` (consigliato) o gestito come processo separato.

---

## 10. Estensioni naturali future

I modelli sopra sono sufficienti per partire, ma si prestano a essere estesi con:
- `Invoice` / `PaymentTransaction` per tracciare gli addebiti reali e lo storico delle transazioni.
- `VehicleTelemetry` per raccogliere velocità, batteria, diagnostica e sensori in tempo reale.
- `FraudSignal` / `SecurityIncident` per un dominio antiabuso più evoluto.
