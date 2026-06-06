Parti dallo stato attuale del progetto dopo il completamento di NearbyVehicles e VehicleDetails. Non ricreare la struttura esistente e non rifare il lavoro già fatto.

IMPORTANTE:
- Puoi usare la skill graphify per esplorare la codebase.
- NON sprecare token nel tentare di riaggiornare o rigenerare il grafo.
- Usa Graphify solo per capire rapidamente i file già presenti e toccare il minimo indispensabile.
- Non aprire o modificare file fuori scope se non necessario.

Devi implementare la slice MVP BookVehicle end-to-end, mantenendo rigorosamente l’architettura VSA già impostata.

## Obiettivo di questo step

Voglio ottenere una terza slice realmente funzionante:
- backend API funzionante per BookVehicle
- repository booking concreti funzionanti
- frontend con CTA prenota attiva da VehicleDetails
- hook mutation TanStack Query funzionante
- feedback UI chiaro dopo prenotazione riuscita o fallita

Non implementare davvero UnlockVehicle o EndRide in questo step.

## Vincoli architetturali obbligatori

- non modificare i principi VSA già impostati
- nessuna slice deve importare un’altra slice
- web e api possono dipendere solo da packages/contracts per tipi e contratti condivisi
- gli adapter concreti devono rimanere fuori dalle slice
- il wiring deve rimanere centralizzato nel composition root
- mantieni naming e struttura già presenti nel progetto
- niente overengineering
- niente refactor ampi
- non toccare NearbyVehicles o VehicleDetails salvo piccoli fix strettamente necessari

## Riferimento funzionale

BookVehicle deve rappresentare la prenotazione di un veicolo da parte dell’utente.

Da documento:
- BookVehicle tocca Customer, Vehicle, Booking
- dipende da IUserRepository, IVehicleRepository, IBookingRepository
- produce una Booking che sarà consumata più avanti da UnlockVehicle

In questo step voglio:
VehicleDetails -> click su “Prenota” -> chiamata API -> booking creata -> vehicle marcato RESERVED -> feedback chiaro in UI

## 1. Verifica contracts solo dove serve

Controlla `packages/contracts` e completa solo ciò che serve davvero a BookVehicle.

Assicurati che esistano ed esportino correttamente:
- Booking
- BookingStatus
- IUserRepository
- IVehicleRepository
- IBookingRepository
- BookVehicleRequest
- BookVehicleResponse

Se i contratti esistono già, riusali.
Aggiungi solo ciò che serve davvero a questa slice.

### Vincoli minimi booking
Una booking deve avere almeno:
- id
- userId
- vehicleId
- reservedAt
- expiresAt
- status

Usa status coerente con `BookingStatus`.

## 2. Persistenza e repository

Implementa davvero il repository booking concreto.

Preferenza:
- se c’è già uno scaffold SQLite/Drizzle coerente, completalo
- se completarlo richiede poco, usa SQLite
- evita in-memory se ormai il resto del flusso persiste già bene su SQLite

Minimo richiesto:
- save(booking)
- findActiveByUser(userId)
- findById(bookingId)
- update(booking)

Riusa il repository veicoli esistente e assicurati che il veicolo venga aggiornato a `RESERVED` quando la prenotazione riesce.

Per `IUserRepository`, se non esiste ancora una vera implementazione sufficiente, usa la soluzione più semplice e demo-friendly coerente con l’architettura:
- repository minimale con un demo user persistito o seedato
- nessuna auth reale

## 3. Backend BookVehicle

Implementa davvero lato API:
- `apps/api/src/slices/BookVehicle/BookVehicle.types.ts`
- `apps/api/src/slices/BookVehicle/BookVehicle.handler.ts`
- `apps/api/src/slices/BookVehicle/BookVehicle.router.ts`

### Comportamento richiesto
L’endpoint BookVehicle deve:
1. ricevere `vehicleId`
2. risolvere l’utente demo corrente in modo semplice e coerente
3. verificare che il veicolo esista
4. verificare che il veicolo sia prenotabile / disponibile
5. verificare che l’utente non abbia già una booking attiva
6. creare una booking con scadenza semplice e leggibile, ad esempio +15 minuti
7. aggiornare lo stato del veicolo a `RESERVED`
8. restituire la booking creata

### Errori minimi da gestire
- vehicle non trovato -> 404
- vehicle non prenotabile -> 409 o 400 coerente
- utente con booking già attiva -> 409
- input invalido -> 400

### Endpoint
Mantieni un endpoint semplice e coerente, ad esempio:
- `POST /api/bookings`

## 4. Composition root

Aggiorna il composition root solo quanto serve per wireare:
- booking repository concreto
- user repository concreto minimo
- vehicle repository già esistente

Mantieni il wiring leggibile e non duplicato.

## 5. Frontend BookVehicle

Implementa davvero lato web:
- `apps/web/src/slices/BookVehicle/BookVehicle.types.ts`
- `apps/web/src/slices/BookVehicle/BookVehicle.hook.ts`
- `apps/web/src/slices/BookVehicle/BookVehicle.page.tsx` solo se davvero utile
  oppure usa la mutation direttamente dentro VehicleDetails in modo pulito, ma senza violare i confini della slice

Scelta preferita:
- crea la slice web BookVehicle con hook e tipi dedicati
- usa la CTA di VehicleDetails solo come entry point UX

### Hook
Il hook deve:
- usare TanStack Query mutation
- chiamare l’endpoint reale di booking
- essere tipizzato
- gestire loading, success, error

Esempio:
`useBookVehicle()`

## 6. Integrazione con VehicleDetails

Aggiorna `VehicleDetails.page.tsx` solo quanto basta per:
- attivare davvero il bottone “Prenota”
- chiamare la mutation di BookVehicle
- mostrare stato loading sul bottone
- mostrare conferma se booking creata
- mostrare errore leggibile se booking fallisce

Non trasformare VehicleDetails in un contenitore di business logic.
La logica di prenotazione deve stare nella slice BookVehicle.

## 7. UX minima richiesta

Dopo prenotazione riuscita, mostra chiaramente:
- booking id oppure conferma prenotazione
- orario di scadenza prenotazione
- stato veicolo aggiornato se disponibile
- CTA o messaggio che anticipa il prossimo step: sblocco veicolo

Va bene una soluzione semplice, ad esempio:
- success card inline
- toast + card
- blocco di conferma sotto il bottone

Non introdurre flussi complessi multi-step.

## 8. Seed e demo user

Se serve, aggiungi o completa:
- demo user coerente
- booking table/schema seed iniziale vuoto o minimo

Importante:
- il progetto deve rimanere avviabile con `pnpm dev`
- niente setup manuale extra complicato

## 9. Non fare queste cose

- non implementare UnlockVehicle
- non implementare EndRide
- non introdurre auth reale
- non introdurre pagamenti
- non introdurre promozioni
- non introdurre mappe o geo feature nuove
- non fare refactor ampi
- non rompere le slice già completate

## 10. README

Aggiorna il README con:
- cosa è stato implementato davvero in BookVehicle
- endpoint disponibile
- come prenotare un veicolo dalla UI
- principali casi di errore gestiti
- TODO del prossimo step: UnlockVehicle

## 11. Output finale atteso

Quando hai finito:
1. mostra i file modificati principali;
2. spiega brevemente le scelte fatte;
3. indica come hai gestito user demo, booking repository e update stato veicolo;
4. mostra come provare BookVehicle in locale;
5. segnala eventuali TODO per il prossimo prompt.

## Stile di esecuzione

- preserva i confini VSA
- tocca il minor numero di file possibile
- punta a una slice completa e dimostrabile
- preferisci semplicità e chiarezza
- non anticipare step futuri