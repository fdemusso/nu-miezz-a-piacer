Parti dallo stato attuale del progetto dopo il completamento di NearbyVehicles, VehicleDetails, BookVehicle e UnlockVehicle. Non ricreare la struttura esistente e non rifare il lavoro già fatto.

IMPORTANTE:
- Puoi usare la skill graphify per esplorare la codebase.
- NON sprecare token nel tentare di riaggiornare o rigenerare il grafo.
- Usa Graphify solo per capire rapidamente i file già presenti e toccare il minimo indispensabile.
- Non aprire o modificare file fuori scope se non necessario.

Devi implementare la slice MVP EndRide end-to-end, mantenendo rigorosamente l’architettura VSA già impostata.

## Obiettivo di questo step

Voglio ottenere una quinta slice realmente funzionante:
- backend API funzionante per EndRide
- chiusura corretta della Ride attiva
- Vehicle che torna disponibile
- ParkingValidationResult mock ma coerente
- costo finale semplice e demo-friendly
- billing mock e notification mock integrati in modo minimale
- frontend con flow di chiusura corsa chiaro e dimostrabile

Questo è l’ultimo step del MVP principale.
Non implementare altre slice oltre EndRide.

## Vincoli architetturali obbligatori

- non modificare i principi VSA già impostati
- nessuna slice deve importare un’altra slice
- web e api possono dipendere solo da packages/contracts per tipi e contratti condivisi
- gli adapter concreti devono rimanere fuori dalle slice
- il wiring deve rimanere centralizzato nel composition root
- mantieni naming e struttura già presenti nel progetto
- niente overengineering
- niente refactor ampi
- non toccare le slice precedenti salvo piccoli fix strettamente necessari

## Riferimento funzionale

Da documento:
- EndRide tocca Ride, Vehicle, Customer, ParkingValidationResult
- dipende da IRideRepository, IVehicleRepository, IZoneValidator, IBillingService, IIncentiveService, INotificationSender
- termina la corsa attiva, registra posizione finale, valida il parcheggio, calcola costo reale, applica eventuale bonus e avvia addebito

Per il MVP voglio una versione semplificata ma coerente:
- recupera la ride attiva dell’utente
- chiude la ride
- imposta `RideStatus.COMPLETED`
- imposta `VehicleStatus.AVAILABLE`
- assegna una endPosition semplice/mock
- produce un `ParkingValidationResult` mock coerente
- calcola un costo finale semplice
- esegue billing mock
- opzionalmente valuta bonus mock semplice
- notifica utente con servizio mock
- restituisce un riepilogo chiaro della corsa conclusa

## 1. Verifica contracts solo dove serve

Controlla `packages/contracts` e completa solo ciò che serve davvero a EndRide.

Assicurati che esistano ed esportino correttamente:
- EndRideRequest
- EndRideResponse
- ParkingValidationResult
- Ride
- RideStatus
- VehicleStatus
- IRideRepository
- IVehicleRepository
- IZoneValidator
- IBillingService
- IIncentiveService
- INotificationSender
- Money
- Coordinates

Se i contratti esistono già, riusali.
Aggiungi solo ciò che serve davvero a questa slice.

## 2. Backend EndRide

Implementa davvero lato API:
- `apps/api/src/slices/EndRide/EndRide.types.ts`
- `apps/api/src/slices/EndRide/EndRide.handler.ts`
- `apps/api/src/slices/EndRide/EndRide.router.ts`

### Comportamento richiesto
L’endpoint EndRide deve:
1. risolvere l’utente demo corrente in modo coerente con gli step precedenti
2. recuperare la ride attiva dell’utente
3. verificare che esista una ride attiva
4. recuperare il veicolo associato
5. determinare una endPosition semplice/mock
6. validare il parcheggio tramite `IZoneValidator` mock/minimo
7. calcolare un costo finale semplice e leggibile
8. opzionalmente valutare un bonus mock semplice
9. chiamare `IBillingService` mock
10. chiamare `INotificationSender` mock
11. aggiornare la ride:
   - status `COMPLETED`
   - endedAt valorizzato
   - endPosition valorizzata
   - finalCost valorizzato
12. aggiornare il veicolo a `AVAILABLE`
13. restituire risposta completa con riepilogo fine corsa

### Errori minimi da gestire
- nessuna ride attiva -> 404 o 409 coerente
- veicolo non trovato -> 404
- billing fallito -> gestisci in modo coerente ma senza rompere inutilmente il flow MVP
- input invalido -> 400

### Endpoint
Mantieni un endpoint semplice e coerente, ad esempio:
- `POST /api/rides/end`
oppure altra convenzione già coerente con il progetto

## 3. Persistenza e repository

Riusa `DrizzleRideRepository` già implementato.
Completa solo ciò che manca davvero per chiudere una ride correttamente.

Assicurati che:
- la ride attiva venga chiusa correttamente
- il veicolo torni `AVAILABLE`
- eventuali campi finali della ride siano persistiti davvero

Non introdurre repository nuovi se non strettamente necessari.

## 4. Mock services minimi

Se non sono già presenti o non sono sufficienti, completa in modo minimale e demo-friendly:
- `MockZoneValidator`
- `MockBillingProcessor`
- `MockIncentiveService`
- `MockNotificationSender`

### Comportamento MVP desiderato
- ZoneValidator: ritorna `ParkingValidationResult` semplice, per default `isAllowed: true`
- BillingService: simula addebito riuscito
- IncentiveService: può restituire `null` oppure piccolo bonus fisso solo se molto semplice
- NotificationSender: simula invio notifica senza integrazioni reali

Non introdurre logiche geografiche reali, provider reali o processi asincroni complessi.

## 5. Composition root

Aggiorna il composition root solo quanto serve per wireare:
- EndRide handler dependencies
- mock services minimi
- ride repository esistente
- vehicle repository esistente

Mantieni il wiring leggibile e non duplicato.

## 6. Frontend EndRide

Implementa davvero lato web:
- `apps/web/src/slices/EndRide/EndRide.types.ts`
- `apps/web/src/slices/EndRide/EndRide.hook.ts`
- `apps/web/src/slices/EndRide/EndRide.page.tsx`
- route Next.js dedicata, ad esempio `/rides/end` oppure una route coerente con il progetto

### Hook
Il hook deve:
- usare TanStack Query mutation
- chiamare l’endpoint reale di end ride
- essere tipizzato
- gestire loading, success, error

Esempio:
`useEndRide()`

### Page
La pagina deve mostrare:
- riepilogo minimo della ride attiva o del veicolo
- bottone “Termina corsa”
- stato loading
- errore leggibile
- schermata di successo con riepilogo finale

## 7. Integrazione con UnlockVehicle

Aggiorna UnlockVehicle solo quanto basta per permettere il passaggio a EndRide.

Richiesto:
- dopo unlock riuscito, mostra CTA/link reale verso la route EndRide
- non incorporare logica EndRide dentro UnlockVehicle
- la transizione deve essere solo routing verso la route dedicata

## 8. Costo finale MVP

Per non perdere tempo, usa una logica semplice ma coerente.

Esempi accettabili:
- costo fisso di sblocco + piccolo costo per durata simulata
oppure
- costo derivato in modo semplice dal pricing plan del veicolo e da una durata mock

Importante:
- il valore deve essere chiaro, consistente e mostrabile in UI
- non serve precisione realistica
- meglio semplice e affidabile che sofisticato e fragile

## 9. UX minima richiesta

Dopo EndRide riuscito, mostra chiaramente:
- ride id
- orario inizio e fine
- costo finale
- esito validazione parcheggio
- bonus applicato o assenza bonus
- stato veicolo tornato disponibile

Va bene una soluzione semplice:
- success card
- elenco riepilogo
- badge stato
- piccolo messaggio finale “mezzo nuovamente disponibile”

Non introdurre mappe, tracking percorso, timeline complesse o ricevute dettagliate.

## 10. Non fare queste cose

- non implementare RideSummary come slice separata
- non introdurre geofencing reale
- non introdurre billing reale
- non introdurre promozioni reali
- non introdurre support ticket
- non fare refactor ampi
- non rompere le slice già completate

## 11. README

Aggiorna il README con:
- cosa è stato implementato davvero in EndRide
- endpoint disponibile
- come completare il flow completo dalla UI
- assunzioni MVP/mock adottate
- eventuali limiti noti del MVP finale

## 12. Output finale atteso

Quando hai finito:
1. mostra i file modificati principali;
2. spiega brevemente le scelte fatte;
3. indica come hai gestito parking validation, billing mock, notification mock e costo finale;
4. mostra come provare il flow completo in locale;
5. segnala eventuali limiti residui del MVP.

## Stile di esecuzione

- preserva i confini VSA
- tocca il minor numero di file possibile
- punta a una slice completa e dimostrabile
- preferisci semplicità e chiarezza
- non anticipare step futuri