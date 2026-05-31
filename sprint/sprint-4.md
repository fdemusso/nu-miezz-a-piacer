# Sprint 4 — Operatori e Pubblica Amministrazione

**Obiettivo:** chiudere le 10 slice rimanenti (5 OP + 5 AP) e ottenere il sistema completo.

**Slice incluse:** OP.01, OP.02, OP.06, OP.08, OP.10, AP.01, AP.02, AP.03, AP.04, AP.05.

## Piano per slice

### OP.01 FleetDistributionMap
- **Handler:** `vehicleRepo.findAll()` → raggruppa per `fleetZone` (ogni vehicle.position viene mappato alla `FleetZone` che lo contiene tramite `zoneValidator.isInsideZone`). Restituisce `{ zoneId, name, count, vehicles: [...] }[]`.
- **Test:** 5 veicoli in 2 zone → counts corretti.

### OP.02 LowAvailabilityAlert
- **Handler:** `fleetZoneRepo.findAll()` → filtra `vehicleCount < targetCount * 0.3`. Per ognuno, `notificationSender.broadcast(allOperatorIds, ...)`.
- **Trigger:** registrato in `main.ts` ogni 5 minuti; endpoint POST per trigger manuale.

### OP.06 VehicleGPSHistory
- **Handler:** input `{ vehicleId, from, to }`. `gpsTrackingService.getHistory(vehicleId, { from, to })`.

### OP.08 ConfigureParkingBonus
- **Handler:** `incentiveService.configureBonusRule(rule)`. Validazione: `rule.bonusAmount.amount > 0`, `rule.zoneId` esiste in `fleetZoneRepo`.

### OP.10 RemoteLockVehicle
- **Handler:** `vehicleRepo.findById` → `unlockService.lock(vehicleId)` → `vehicle.status = 'maintenance'`. Notifica eventuale utente attivo: se `rideRepo.findActiveByUser` per quel vehicle esiste, `notificationSender.send(userId, 'Veicolo bloccato remotamente', reason)` e chiudi la ride forzata (cost = 0).

### AP.01 UsageFrequencyReport
- **Handler:** input `{ from, to }`. `reportingService.getUsageFrequency({ from, to })`. Restituisce mappa `day → rideCount`.

### AP.02 MobilityPeriodicReport
- **Handler:** `reportingService.getMobilityReport({ from, to })`.

### AP.03 MarkUrbanWarningZone
- **Handler:** input `{ name, boundary, type: 'sensitive' | 'forbidden' }`. `zoneRepo.save({ id, type, name, boundary })`. Broadcast a tutti gli utenti attivi via `notificationSender`.

### AP.04 HighDensityZoneMap
- **Handler:** `reportingService.getHighDensityZones()`.

### AP.05 DefineSensitiveZone
- **Handler:** `zoneRepo.save({...type: 'sensitive'})`. Differenza con AP.03: persistente, non temporaneo, niente broadcast — solo configurazione.

## Web (Sprint 4)

- Tab Operator: mappa flotta, alert availability, history GPS, form bonus, lock remoto.
- Tab Admin: 3 form report (usage / mobility / density) + 2 form zone (warning / sensitive).

## Definition of Done

- 10 slice testate.
- `sliceRegistry.ts` aggiornato con visibilità corretta per ruolo per **tutte** le 32 slice.
- Documentazione finale: aggiornare `README.md` di root con sezione "Stato slice (32/32 implementate)".
- Tag git `v1.0.0`.

## Cosa resta dopo lo Sprint 4 (backlog)

- Persistenza reale SQLite per gli adapter di *service* (oggi solo i repo passano a SQLite in Sprint 0).
- Auth JWT vera (oggi `JwtAuthService` è un mock — sostituibile senza toccare slice).
- Push notifications reali (Firebase) — `FirebasePushSender` è ancora un logger.
- Routing reale (OSRM) — `HaversineRoutingService` resta solo per stime preliminari.
- Telemetria veicoli + frodi (estensioni naturali citate nel doc).
