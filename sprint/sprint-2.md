# Sprint 2 — Ciclo di vita corsa

**Obiettivo:** flusso completo prenotazione → sblocco → uso → pausa → termine → addebito.

**Slice incluse:** UT.02, UT.04, UT.05, UT.13, UT.14, UT.16, OP.11.

## Macchina a stati di riferimento

```
Vehicle:   available ─reserve→ reserved ─unlock→ in_use ⇄ in_use(paused) ─lock+end→ available
Booking:   active ─unlock→ converted    │      ↓ expire
                       └─timeout──→ expired
Ride:      (start) ─pause→ paused → resume → ended
```

Tutti i transition vivono **dentro gli handler**, non negli adapter.

## Piano per slice

### UT.02 BookVehicle
- **Handler:** `userRepo.findById(req.userId)` → 404 se mancante o `suspended`. `vehicleRepo.findById(req.vehicleId)` → 404 / 409 se non `available`. Verifica `bookingRepo.findActiveByUser` vuoto. Crea `Booking` con `expiresAt = now + 15min`, status `'active'`. Aggiorna `vehicle.status = 'reserved'` e salva.
- **Errori espliciti:** `USER_SUSPENDED`, `VEHICLE_UNAVAILABLE`, `USER_ALREADY_BOOKING`.

### UT.13 UnlockVehicle
- **Handler:** `bookingRepo.findById(req.bookingId)` → 404 / 410 se `expired`. Verifica `req.userId === booking.userId`. `vehicleRepo.findById(booking.vehicleId)`. Chiama `unlockService.unlock(vehicleId, method)`. Transiziona booking → `'converted'`, vehicle → `'in_use'`. Crea `Ride` con `startedAt = now`, `startPosition = vehicle.position`, `paused = false`. Restituisce `{ rideId }`.
- **Atomicità:** salva nell'ordine vehicle → booking → ride; se uno step fallisce, gli step precedenti restano consistenti (non c'è transazione cross-repo, accettato in MVP, documentato).

### UT.14 UnlockMethod
- **Handler:** `vehicleRepo.findById` → `unlockService.getAvailableMethods(vehicle)`. Pre-step di UT.13.

### UT.16 PauseRide
- **Handler:** `rideRepo.findActiveByUser(req.userId)` → 404. Toggle `paused`. Salva. Restituisce nuovo stato. Vehicle status invariato (resta `in_use`).
- **Doc:** la tariffa di pausa non è modellata nei contratti attuali — rinviata; il flag basta per ora.

### UT.04 EndRide (orchestrator)
Questo è il cuore dello sprint. Sequenza:
1. `rideRepo.findActiveByUser(req.userId)` → 404.
2. `vehicleRepo.findById(ride.vehicleId)`.
3. `zoneValidator.validate(req.endPosition, zoneRepo.findAll())` → `ParkingValidationResult`.
4. Se invalid: ritorna 422 con `reason` — la corsa NON si chiude. Il client deve spostare il veicolo o accettare la penale (out of scope MVP).
5. `pricingService.estimateCost(vehicle, ride.endedAt - ride.startedAt)` → `cost`.
6. `billingService.charge(userId, cost.estimatedTotal)`.
7. Se la zona di parcheggio è in `incentive`, `incentiveService.applyParkingBonus(userId, zoneId)`.
8. `unlockService.lock(vehicle.id)`.
9. Aggiorna ride (`endedAt`, `endPosition`, `cost`), vehicle (`status = 'available'`, `position = endPosition`).
10. `notificationSender.send(userId, 'Corsa terminata', summary)`.

- **Test:** end fuori zona di parcheggio (422), end ok senza bonus, end ok con bonus (verifica `incentiveService.getGrantsForTest()`).

### UT.05 RideSummary
- **Handler:** `rideRepo.findById` → join client-side con `vehicleRepo.findById` per `vehicle.type/licensePlate`. Restituisce `{ ride, vehicleType, vehiclePlate, durationSeconds }`.

### OP.11 ExpiredBookingsMonitor (cron)
- **Handler:** `bookingRepo.findExpired()` → per ognuna: `booking.status = 'expired'`, `vehicle.status = 'available'`, `notificationSender.send(booking.userId, 'Prenotazione scaduta', ...)`.
- **Trigger:** un `setInterval(60_000)` registrato in `main.ts` chiama l'handler. Stesso handler esposto come endpoint POST per testing manuale e per UI operator.

## Web (Sprint 2)

- Tab Customer: pulsante "Prenota" sulla card del veicolo, schermata "Corsa attiva" con pause/end, riepilogo post-corsa.
- Tab Operator (skeleton): tabella prenotazioni scadute.

## Definition of Done

- 7 slice testate, l'orchestrator `EndRide` con almeno 3 test (ok, fuori zona, con bonus).
- Job di sweep funzionante; verificato manualmente lasciando scadere una booking.
- Flusso end-to-end documentato in `sprint/flusso-corsa.md` (opzionale).
