Parti dallo stato attuale del progetto dopo il completamento di NearbyVehicles. Non ricreare la struttura esistente e non rifare il lavoro già fatto.

IMPORTANTE:
- Puoi usare la skill graphify per esplorare la codebase.
- NON sprecare token nel tentare di riaggiornare o rigenerare il grafo.
- Usa Graphify solo per capire rapidamente i file già presenti e toccare il minimo indispensabile.
- Non aprire o modificare file fuori scope se non necessario.

Devi implementare la slice MVP VehicleDetails end-to-end, mantenendo rigorosamente l’architettura VSA già impostata.

## Obiettivo di questo step

Voglio ottenere una seconda slice realmente funzionante:
- backend API funzionante per VehicleDetails
- route frontend dinamica funzionante
- hook TanStack Query funzionante
- pagina dettaglio veicolo mobile-first
- CTA chiara verso prenotazione, senza implementare ancora davvero BookVehicle

Non implementare davvero BookVehicle, UnlockVehicle o EndRide in questo step.

## Vincoli architetturali obbligatori

- non modificare i principi VSA già impostati
- nessuna slice deve importare un’altra slice
- web e api possono dipendere solo da packages/contracts per tipi e contratti condivisi
- gli adapter concreti devono rimanere fuori dalle slice
- il wiring deve rimanere centralizzato nel composition root
- mantieni naming e struttura già presenti nel progetto
- niente overengineering
- niente refactor ampi
- non toccare NearbyVehicles salvo piccoli fix strettamente necessari

## Riferimento funzionale

VehicleDetails deve rappresentare la slice che espone le caratteristiche complete di un veicolo:
- tipo
- stato
- batteria/autonomia se presenti
- pricing plan
- specs
- features
- eventuale zona
- CTA prenota

L’obiettivo UX è:
lista NearbyVehicles -> click card -> pagina dettaglio veicolo -> CTA prenota

La CTA può per ora portare a una route placeholder o a un bottone disabilitato con testo coerente, ma non deve implementare la logica reale di BookVehicle.

## 1. Verifica contracts senza allargare scope

Controlla `packages/contracts` e completa solo ciò che serve a VehicleDetails.

Assicurati che esistano ed esportino correttamente i tipi necessari per:
- Vehicle
- PricingPlan
- VehicleSpecs
- VehicleFeatures
- BatteryInfo
- VehicleStatus
- VehicleType
- Coordinates
- VehicleDetailsResponse oppure tipo equivalente minimale

Se i contratti esistono già, riusali.
Aggiungi solo DTO o tipi strettamente necessari alla slice.

### VehicleDetailsResponse desiderata
Deve contenere almeno:
- vehicle: Vehicle
oppure una forma derivata minimale ma completa per la UI

Non introdurre nuovi modelli di dominio non necessari.

## 2. Backend VehicleDetails

Implementa davvero lato API:
- `apps/api/src/slices/VehicleDetails/VehicleDetails.types.ts`
- `apps/api/src/slices/VehicleDetails/VehicleDetails.handler.ts`
- `apps/api/src/slices/VehicleDetails/VehicleDetails.router.ts`

### Regole
- usa `IVehicleRepository`
- sfrutta `findById` già esistente se disponibile
- non introdurre nuove dipendenze se non servono
- router solo HTTP
- handler solo logica applicativa

### Comportamento richiesto
L’endpoint VehicleDetails deve:
1. ricevere `vehicleId`
2. recuperare il veicolo
3. restituire 404 se non esiste
4. restituire un payload pulito e tipizzato se esiste

### Endpoint
Mantieni un endpoint semplice e prevedibile, ad esempio:
- `GET /api/vehicles/:id`

Se esiste già una convenzione migliore nel progetto, seguila senza stravolgere nulla.

## 3. Composition root

Aggiorna il composition root solo se serve per wireare correttamente VehicleDetails.
Non duplicare wiring già esistente.
Riusa il repository veicoli già introdotto nello step precedente.

## 4. Frontend VehicleDetails

Implementa davvero lato web:
- `apps/web/src/slices/VehicleDetails/VehicleDetails.types.ts`
- `apps/web/src/slices/VehicleDetails/VehicleDetails.hook.ts`
- `apps/web/src/slices/VehicleDetails/VehicleDetails.page.tsx`

### Hook
Il hook deve:
- chiamare l’endpoint reale VehicleDetails
- usare TanStack Query
- essere tipizzato
- gestire loading/error in modo pulito

Esempio: `useVehicleDetails(vehicleId)`

### Page
La pagina deve mostrare in modo chiaro e mobile-first:
- nome/codice mezzo
- tipo
- stato
- batteria e autonomia se presenti
- pricing plan leggibile
- specs principali
- features/dotazioni principali
- eventuale zona
- CTA prenota
- stato loading
- stato errore
- stato not found

UI sobria, realistica, coerente con NearbyVehicles.

## 5. Route Next.js

Crea la route dinamica:
- `apps/web/src/app/vehicles/[id]/page.tsx`

Questa route deve:
- leggere `id` dai params
- rendere `VehicleDetailsPage`
- restare sottile, senza logica pesante

## 6. Integrazione con NearbyVehicles

Aggiorna NearbyVehicles solo quanto basta per permettere la navigazione verso il dettaglio.

Richiesto:
- ogni card veicolo deve avere CTA o link verso `/vehicles/[id]`
- non riscrivere l’intera UI NearbyVehicles
- non introdurre coupling tra slice
- la navigazione deve essere solo routing, non import diretto di logiche da VehicleDetails

## 7. CTA prenota

In questa fase NON implementare la logica reale di BookVehicle.

La CTA “Prenota” nella pagina VehicleDetails può essere:
- un bottone disabilitato con label tipo “Prenotazione nel prossimo step”
oppure
- un link placeholder coerente a una futura route di booking

Scegli la soluzione più pulita e demo-friendly.
Non introdurre repository booking, validazioni booking o stato booking reale in questo step.

## 8. Dati e presentazione

Riusa i dati seed già presenti.
Se un seed veicolo è troppo povero per mostrare bene `pricingPlan`, `specs`, `features` o `batteryInfo`, arricchisci i seed esistenti in modo minimo e coerente.
Non creare nuove strutture inutili.

Presentazione consigliata:
- hero/card principale veicolo
- sezione pricing
- sezione specifiche
- sezione dotazioni
- footer action sticky mobile con CTA prenota

## 9. Non fare queste cose

- non implementare BookVehicle
- non implementare UnlockVehicle
- non implementare EndRide
- non introdurre auth
- non introdurre mappe
- non introdurre GeoJSON
- non aggiungere librerie pesanti
- non fare refactor di NearbyVehicles oltre il minimo necessario
- non duplicare tipi già presenti in contracts

## 10. README

Aggiorna il README con:
- cosa è stato implementato davvero in VehicleDetails
- route disponibile
- endpoint disponibile
- come testare il dettaglio veicolo da NearbyVehicles
- TODO del prossimo step: BookVehicle

## 11. Output finale atteso

Quando hai finito:
1. mostra i file modificati principali;
2. spiega brevemente le scelte fatte;
3. indica se hai riusato repository e seed esistenti o li hai estesi;
4. mostra come provare VehicleDetails in locale;
5. segnala eventuali TODO per il prossimo prompt.

## Stile di esecuzione

- preserva i confini VSA
- tocca il minor numero di file possibile
- punta a una slice completa e dimostrabile
- preferisci semplicità e chiarezza
- non anticipare step futuri