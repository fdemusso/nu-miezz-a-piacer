# Essenziale — distillato da `studio migrazione VSA.md`

Versione operativa, taglia tutto ciò che è aspirazionale e tiene solo ciò che vincola il codice.

## Invarianti VSA (non negoziabili)

1. **Una slice = una funzionalità verticale.** Una cartella in `apps/api/src/slices/<Slice>/` con esattamente: `<Slice>.types.ts`, `<Slice>.handler.ts`, `<Slice>.router.ts` (+ `.test.ts`).
2. **Mai import tra slice** (né api↔api, né web↔web).
3. Web e api importano **solo** `@vsa/contracts` per i tipi condivisi.
4. Le implementazioni concrete vivono in `apps/api/src/adapters/` e implementano interfacce di `contracts`.
5. Il wiring avviene **solo** in `apps/api/src/composition/container.ts`.
6. Slice produttore/consumatore comunicano **solo via repo/service condivisi** (`BookVehicle` produce `Booking`, `UnlockVehicle` la consuma via `IBookingRepository`).

## Differenza importante tra doc e codice

Il documento `studio migrazione VSA.md` descrive una versione **ricca** del dominio (classi astratte `User`/`Vehicle` con metodi polimorfici, enum dettagliati, repo con `update`/`findExpiredNotStarted`/...).

Il **codice reale** in `packages/contracts/src/index.ts` è una versione semplificata: type union literal invece di enum, `User` come interfaccia piatta, niente classi, repo minimalisti (`save` invece di `save`+`update`).

**Decisione operativa:** segui i contratti del codice, **non** il documento, quando i due divergono. Il doc è una mappa concettuale, non una spec.

## Adapter base disponibili (implementati in-memory in Sprint 0 input)

Tutti sotto `apps/api/src/adapters/`. Backed by `Map<string, Entity>` — nessuna dipendenza esterna.

| Adapter | Implementa | Note |
|---|---|---|
| `SqliteUserRepository` | `IUserRepository` | Map, indice secondario su email |
| `SqliteVehicleRepository` | `IVehicleRepository` | `findNearby` usa haversine |
| `SqliteBookingRepository` | `IBookingRepository` | `findExpired` confronta `expiresAt` con `Date.now()` |
| `SqliteRideRepository` | `IRideRepository` | `findActiveByUser` = ride senza `endedAt`; aggiunge `findAll()` per il reporting |
| `SqliteZoneRepository` | `IZoneRepository` | Map semplice |
| `SqliteFleetZoneRepository` | `IFleetZoneRepository` | Map semplice |
| `JwtAuthService` | `IAuthService` | In-memory user store + suspended set; metodo `registerForTest` per seed |
| `GeoZoneValidator` | `IZoneValidator` | Ray-casting point-in-polygon; `validate` rifiuta zone `forbidden`, esige `parking` se presente |
| `HaversineRoutingService` | `IRoutingService` | Walking 1.4 m/s, riding 5.0 m/s |
| `StandardPricingService` | `IPricingService` | Unlock fee + tariffa al minuto per tipo veicolo |
| `MockBillingProcessor` | `IBillingService` | Logga charges + payment methods in memoria |
| `StandardPromotionService` | `IPromotionService` | Map per codice; sconto percentuale con cutoff su `validUntil` |
| `StandardIncentiveService` | `IIncentiveService` | Map per zona + log delle grant |
| `FirebasePushSender` | `INotificationSender` | Log in memoria — il nome è un placeholder, comportamento è "console+log" |
| `MockUnlockService` | `IUnlockService` | Set di veicoli sbloccati; `getAvailableMethods` per tipo |
| `GpsTrackingService` | `IGpsTrackingService` | Latest + history map; richiede seed via `recordForTest` |
| `StandardMaintenanceService` | `IMaintenanceService` | Coda ordinata per severità + data |
| `StandardSupportService` | `ISupportService` | Map per id, sequence per id ticket |
| `StandardReportingService` | `IReportingService` | Riceve `rideRepo` + `fleetZoneRepo` via costruttore; aggrega in-memory |

Questi 19 file fanno **già compilare e bootstrappare** il container senza errori. Sono il floor della Sprint 0.

## Cosa il doc richiede di rispettare in fase di sviluppo

- **3 file per slice** lato api, 3 file lato web (stessa convenzione di nomi).
- **DI a costruttore**, mai `import` di repo/service concreti dall'handler.
- **Composition root unico** che decide quale implementazione usare.
- **Persistenza dietro repository** — quando passeremo da Map a SQLite reale, nessuna slice deve cambiare.

## Cosa NON portarsi appresso dal doc

- Classi astratte `User`/`Vehicle` con metodi `canStartRide()` ecc. — nel codice sono interfacce piatte.
- Enum (`VehicleStatus`, `RideStatus`, ...) — nel codice sono union literal type.
- Schema "ricco" delle entità (es. `Customer.savedPaymentMethods`, `Vehicle.pricingPlan` annidato): nel codice il dominio è più piatto. Promuovi solo quando una slice lo richiede davvero.
- Interfacce gonfie (`IVehicleRepository.update`, `findAvailableByZone`, ...): aggiungi solo se una slice le chiama.
