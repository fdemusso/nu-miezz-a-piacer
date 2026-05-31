# Sprint 1 — Customer: scoperta, tariffa, pagamento

**Obiettivo:** un utente può aprire la mappa, vedere mezzi vicini, sapere quanto costa raggiungerli e usarli, applicare uno sconto, gestire i metodi di pagamento.

**Slice incluse:** UT.01, UT.03, UT.06, UT.07, UT.09, UT.12, UT.15.

## Piano per slice

### UT.01 NearbyVehicles
- **Handler:** input `{ position, radiusMeters }`. Chiamare `vehicleRepo.findNearby`. Filtrare per `status === 'available'` e `batteryLevel > 10`. Restituire array con `{ id, type, position, batteryLevel }`.
- **Test:** 3 veicoli, uno fuori raggio, uno in `maintenance`, uno scarico → ritorna 1 elemento.
- **Web:** pagina `NearbyVehicles.page.tsx` con mappa (leaflet) + hook che ripolla ogni 10s.

### UT.03 EstimateRideCost
- **Handler:** input `{ vehicleId, durationSeconds, promoCode? }`. `vehicleRepo.findById` → `pricingService.estimateCost` → se `promoCode`, `promotionService.apply`. Errore se veicolo non esiste.
- **Test:** copertura su veicolo inesistente, promo invalida, promo applicata.

### UT.06 VehicleDetails
- **Handler:** `vehicleRepo.findById` → 404 se null. Restituisce tutto `Vehicle`.
- **Test:** trivial — happy + not found.

### UT.07 EstimateWalkTime
- **Handler:** input `{ from, vehicleId }`. `vehicleRepo.findById` → `routingService.estimateWalk(from, vehicle.position)`.
- **Test:** distanza ~0 → durationSeconds ~0; vehicle not found → 404.

### UT.09 ApplyPromotion
- **Handler:** `promotionService.validate(code)` → ritorna `Promotion | null`. **Non** applica nulla a una stima; è puro lookup. (La composizione con il costo avviene in UT.03 / UT.04.)
- **Test:** codice valido, codice scaduto, codice inesistente.

### UT.12 VehicleBatteryStatus
- **Handler:** `vehicleRepo.findById` → `{ batteryLevel, estimatedRangeKm }` (range = batteryLevel × 0.5 km come baseline; raffinabile per tipo).
- **Test:** happy path.

### UT.15 ManagePaymentMethod
- **Handler:** 3 sotto-azioni in base a `req.action`: `'add' | 'remove' | 'list'`. Usa `billingService.addPaymentMethod` / `removePaymentMethod` + uno store locale in `MockBillingProcessor` per il list (esporre `listPaymentMethods(userId)` nell'adapter come metodo di test).
- **Decisione:** se vogliamo restare puri rispetto al contratto, aggiungere `listPaymentMethods` a `IBillingService`. Altrimenti gestire via `Customer.paymentMethods` su `userRepo`. **Preferenza:** aggiungere il metodo al contratto — è la prima evoluzione legittima.
- **Test:** add → list mostra l'aggiunto; remove → list non più presente.

## Web (Sprint 1)

- Tab Customer con: mappa veicoli vicini, dettaglio veicolo on-click, calcolatore costo, form metodi di pagamento.
- Hook condivisi solo dentro la singola slice (`apps/web/src/slices/<Slice>/<Slice>.hook.ts`).

## Definition of Done

- 7 slice testate, 7 pagine web minimali, 1 endpoint customer protetto per utente autenticato (basta uno stub `X-User-Id` header — auth completa è in Sprint 3).
- Aggiunta `listPaymentMethods` al contratto se scelta opzione A; documentata.
- Smoke test E2E manuale: aprire pagina, vedere mezzo, calcolare costo, aggiungere carta.
