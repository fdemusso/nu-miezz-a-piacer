Parti dallo stato attuale del progetto dopo il completamento di NearbyVehicles, VehicleDetails e BookVehicle. Non ricreare la struttura esistente e non rifare il lavoro già fatto.

IMPORTANTE:
- Puoi usare la skill graphify per esplorare la codebase.
- NON sprecare token nel tentare di riaggiornare o rigenerare il grafo.
- Usa Graphify solo per capire rapidamente i file già presenti e toccare il minimo indispensabile.
- Non aprire o modificare file fuori scope se non necessario.

Devi implementare la slice MVP UnlockVehicle end-to-end, mantenendo rigorosamente l’architettura VSA già impostata.

## Obiettivo di questo step

Voglio ottenere una quarta slice realmente funzionante:
- backend API funzionante per UnlockVehicle
- repository Ride concreto funzionante
- uso del MockUnlockService già coerente col MVP
- frontend con pagina/flow di sblocco funzionante
- booking consumata correttamente
- veicolo transizionato da RESERVED a INUSE
- Ride creata correttamente

Non implementare EndRide in questo step.

## Vincoli architetturali obbligatori

- non modificare i principi VSA già impostati
- nessuna slice deve importare un’altra slice
- web e api possono dipendere solo da packages/contracts per tipi e contratti condivisi
- gli adapter concreti devono rimanere fuori dalle slice
- il wiring deve rimanere centralizzato nel composition root
- mantieni naming e struttura già presenti nel progetto
- niente overengineering
- niente refactor ampi
- non toccare NearbyVehicles, VehicleDetails o BookVehicle salvo piccoli fix strettamente necessari

## Riferimento funzionale

Da documento:
- UnlockVehicle tocca Customer, Vehicle, Booking, Ride
- dipende da IUnlockService, IBookingRepository, IRideRepository, IVehicleRepository
- valida la Booking, esegue sblocco, transiziona Vehicle da RESERVED a INUSE e crea la Ride

In questo step voglio:
BookVehicle riuscito -> accesso a flow di sblocco -> conferma sblocco -> ride creata -> vehicle INUSE -> feedback chiaro in UI

## Scelta MVP importante

Per questo step NON introdurre una slice separata UnlockMethod.
Per semplicità MVP:
- usa un metodo mock fisso/coerente (es. QR o BLE)
oppure
- fai scegliere un metodo in modo minimale dentro la UI di UnlockVehicle senza creare una nuova slice

Importante:
- non creare adesso una slice UnlockMethod separata
- non ampliare inutilmente lo scope

## 1. Verifica contracts solo dove serve

Controlla `packages/contracts` e completa solo ciò che serve davvero a UnlockVehicle.

Assicurati che esistano ed esportino correttamente:
- Ride
- RideStatus
- Booking
- BookingStatus
- IUnlockService
- IBookingRepository
- IRideRepository
- IVehicleRepository
- UnlockMethodType se già utile e disponibile
- UnlockVehicleRequest
- UnlockVehicleResponse

Se i contratti esistono già, riusali.
Aggiungi solo ciò che serve davvero a questa slice.

### Ride minima richiesta
Una ride deve avere almeno:
- id
- userId
- vehicleId
- status
- startedAt
- startPosition

Usa status coerente con `RideStatus`.

## 2. Persistenza e repository

Implementa davvero il repository Ride concreto.

Preferenza:
- se c’è già uno scaffold SQLite/Drizzle coerente, completalo
- evita in-memory se il resto del flusso ormai usa già persistenza reale

Minimo richiesto:
- save/create ride
- findById
- findActiveByUser
- update

Assicurati anche che:
- la booking usata venga aggiornata in modo coerente (es. CONVERTED_TO_RIDE oppure stato equivalente già presente nei contratti)
- il veicolo venga aggiornato a `INUSE`

Usa i repository già esistenti per booking e vehicle, senza duplicare logica.

## 3. Backend UnlockVehicle

Implementa davvero lato API:
- `apps/api/src/slices/UnlockVehicle/UnlockVehicle.types.ts`
- `apps/api/src/slices/UnlockVehicle/UnlockVehicle.handler.ts`
- `apps/api/src/slices/UnlockVehicle/UnlockVehicle.router.ts`

### Comportamento richiesto
L’endpoint UnlockVehicle deve:
1. ricevere `vehicleId` e identificativo demo utente
2. recuperare la booking attiva dell’utente o la booking del veicolo in modo coerente
3. verificare che la booking esista e sia valida
4. verificare che il veicolo sia in stato `RESERVED`
5. chiamare `MockUnlockService`
6. se lo sblocco va a buon fine:
   - creare la Ride
   - aggiornare booking a stato convertito/coerente
   - aggiornare veicolo a `INUSE`
7. restituire la ride creata

### Errori minimi da gestire
- booking non trovata -> 404 o 409 coerente
- booking scaduta/non valida -> 409
- vehicle non in stato RESERVED -> 409
- unlock fallito -> 502 o 500 coerente
- input invalido -> 400

### Endpoint
Mantieni un endpoint semplice e coerente, ad esempio:
- `POST /api/unlocks`
oppure
- `POST /api/vehicles/:id/unlock`

Segui la convenzione già più coerente nel progetto.

## 4. Composition root

Aggiorna il composition root solo quanto serve per wireare:
- ride repository concreto
- unlock service mock già esistente o minimo da completare
- booking repository già esistente
- vehicle repository già esistente

Mantieni il wiring leggibile e non duplicato.

## 5. Frontend UnlockVehicle

Implementa davvero lato web:
- `apps/web/src/slices/UnlockVehicle/UnlockVehicle.types.ts`
- `apps/web/src/slices/UnlockVehicle/UnlockVehicle.hook.ts`
- `apps/web/src/slices/UnlockVehicle/UnlockVehicle.page.tsx`
- route Next.js dedicata, ad esempio `/vehicles/[id]/unlock`

### Hook
Il hook deve:
- usare TanStack Query mutation
- chiamare l’endpoint reale di unlock
- essere tipizzato
- gestire loading, success, error

Esempio:
`useUnlockVehicle()`

### Page
La pagina deve mostrare:
- riepilogo booking/veicolo minimo
- metodo di sblocco mock o selezione minimale
- bottone “Sblocca veicolo”
- stato loading
- errore leggibile
- successo con dati ride creati

## 6. Integrazione con BookVehicle

Aggiorna BookVehicle solo quanto basta per permettere il passaggio allo sblocco.

Richiesto:
- dopo prenotazione riuscita, mostra CTA/link verso unlock
- non incorporare la logica di unlock dentro BookVehicle
- la transizione deve essere solo routing verso la route di UnlockVehicle

## 7. UX minima richiesta

Dopo unlock riuscito, mostra chiaramente:
- ride id oppure conferma corsa avviata
- orario di inizio
- stato veicolo in uso
- hint chiaro verso prossimo step EndRide

Va bene una soluzione semplice:
- success card
- CTA disabilitata dopo successo
- messaggio inline

Non introdurre mappe live, tracking reale o timer complessi.

## 8. Demo assumptions

Per questo step va bene:
- user demo hardcoded coerente con il booking step precedente
- unlock service mock che restituisce successo
- startPosition derivata dalla posizione corrente del veicolo

Non introdurre auth reale, BLE reale, QR scanning reale o integrazioni esterne.

## 9. Non fare queste cose

- non implementare EndRide
- non creare una slice UnlockMethod separata
- non introdurre auth reale
- non introdurre tracking reale avanzato
- non introdurre geofence/zone validator
- non introdurre pagamenti
- non fare refactor ampi
- non rompere le slice già completate

## 10. README

Aggiorna il README con:
- cosa è stato implementato davvero in UnlockVehicle
- endpoint disponibile
- come avviare una ride dalla UI
- assunzioni MVP/mock adottate
- TODO del prossimo step: EndRide

## 11. Output finale atteso

Quando hai finito:
1. mostra i file modificati principali;
2. spiega brevemente le scelte fatte;
3. indica come hai gestito ride repository, booking conversion e update stato veicolo;
4. mostra come provare UnlockVehicle in locale;
5. segnala eventuali TODO per il prossimo prompt.

## Stile di esecuzione

- preserva i confini VSA
- tocca il minor numero di file possibile
- punta a una slice completa e dimostrabile
- preferisci semplicità e chiarezza
- non anticipare step futuri