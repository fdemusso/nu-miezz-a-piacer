# Sprint 3 — Supporto, danni, sicurezza

**Obiettivo:** copertura delle interazioni anomale (segnalazioni, ticket, sospensioni) e dello smart routing.

**Slice incluse:** UT.08, UT.10, UT.11, OP.03, OP.04, OP.05, OP.07, OP.09.

## Piano per slice

### UT.10 OpenSupportTicket
- **Handler:** `supportService.openTicket(userId, subject, body)` → ritorna il ticket creato.
- **Test:** apertura, list per utente, list globale.

### UT.11 ReportDamagedVehicle
- **Handler:** input `{ vehicleId, description, severity }`. `maintenanceService.reportDamage({...})`. Se `severity === 'high'`, `notificationSender.send(operatorId, ...)` per ogni operator. (Per ora hardcoded `operatorId = 'op_1'`; nello sprint 4 si broadcast a tutti gli operator via `userRepo`.)
- **Side effect:** se high, `vehicleRepo.save({...vehicle, status: 'maintenance'})`.

### UT.08 SuggestBestVehicle
- **Handler:** input `{ from, to }`. `vehicleRepo.findNearby(from, 500)` → per ogni veicolo: `routingService.estimateWalk(from, v.position)` + `routingService.estimateRoute(v.position, to)` + `pricingService.estimateCost(v, route.durationSeconds)`. Ordina per `totalTime = walk + route.duration`, filtra fuori chi attraversa una zona `forbidden` (controllabile via `zoneValidator.validate` lungo il route — semplificazione: validare endpoint, non l'intero path).
- **Test:** 3 veicoli, uno fuori zona, uno troppo lontano → ordine corretto.

### OP.03 ReceiveMalfunctionReport
- **Handler:** `maintenanceService.getQueue()` filtrata per `severity in ['medium', 'high']`. Read-only.

### OP.05 MaintenanceQueue
- **Handler:** `maintenanceService.getQueue()` integrale. Differenza con OP.03: questo è il backlog completo, l'altro è la inbox.

### OP.07 ManageSupportTickets
- **Handler:** `supportService.listTickets()` + endpoint per cambiare stato (`'open' → 'in_progress' → 'resolved'`). Richiede aggiunta di `updateTicketStatus(ticketId, status)` a `ISupportService` — prima evoluzione legittima del contratto in Sprint 3.

### OP.09 SuspendUserAccount
- **Handler:** `authService.suspendUser(userId)`. Inoltre `userRepo.save({...user, suspended: true})`. Lo `authService` interno mantiene il proprio set, il flag in `User` è ciò che vede il resto del sistema (es. `BookVehicle` lo controlla).
- **Test:** dopo suspend, `BookVehicle` per quello userId restituisce `USER_SUSPENDED`.

### OP.04 VerifyParkingPosition
- **Handler:** input `{ vehicleId }`. `vehicleRepo.findById` → `gpsTrackingService.getPosition(vehicleId)` → `zoneRepo.findAll()` → `zoneValidator.validate(pos, zones)`. Operatore usa questo per verificare retroattivamente un parcheggio dubbio.

## Web (Sprint 3)

- Tab Customer: bottone "Segnala danno" sul dettaglio veicolo + sul riepilogo corsa.
- Tab Operator: lista ticket + lista maintenance queue + bottone sospendi utente.

## Definition of Done

- 8 slice testate.
- `ISupportService.updateTicketStatus` aggiunto al contratto + documentato in `essenziale.md`.
- Smoke: utente segnala high-severity → veicolo passa in `maintenance` → operatore lo vede in coda.
