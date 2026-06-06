Parti dallo stato attuale del progetto già scaffoldato. Non ricreare la struttura esistente. Devi invece consolidare i contratti minimi mancanti e implementare davvero la slice MVP NearbyVehicles end-to-end, mantenendo l’architettura VSA già impostata. Puoi usare la skill graphify per esplorare la codebase. NON sprecare token nel tentare di riaggiornare il grafo.

## Obiettivo di questo step
Voglio ottenere una prima slice realmente funzionante:
- backend API funzionante per NearbyVehicles
- repository concreti minimi funzionanti
- seed demo coerenti
- frontend mobile-first funzionante
- hook TanStack Query funzionante
- pagina NearbyVehicles che mostra davvero i veicoli vicini

Non implementare ancora davvero BookVehicle, UnlockVehicle, EndRide o VehicleDetails oltre il minimo necessario per non rompere il progetto.

## Vincoli architetturali obbligatori
- non modificare i principi VSA già impostati
- nessuna slice deve importare un’altra slice
- web e api possono dipendere solo da packages/contracts per tipi e contratti condivisi
- gli adapter concreti devono rimanere fuori dalle slice
- il wiring deve rimanere centralizzato nel composition root
- mantieni naming e struttura già presenti nel progetto
- niente overengineering
- niente librerie nuove non necessarie

## 1. Verifica e completa packages/contracts solo dove serve
Controlla i contratti esistenti e completa solo ciò che serve davvero a NearbyVehicles.

Assicurati che esistano ed esportino correttamente:
- Coordinates
- VehicleType
- VehicleStatus
- Vehicle
- FleetZone
- NearbyVehiclesItem
- NearbyVehiclesResponse
- IVehicleRepository
- IFleetZoneRepository
- IGpsTrackingService

Aggiungi solo i campi strettamente necessari al caso d’uso NearbyVehicles.

### NearbyVehiclesResponse desiderata
Deve contenere almeno:
- userPosition
- radiusMeters
- vehicles: array di NearbyVehiclesItem

### NearbyVehiclesItem desiderato
Ogni item deve avere almeno:
- id
- plateOrCode
- type
- status
- batteryLevel o batteryInfo minimale
- distanceMeters
- estimatedWalkMinutes opzionale o semplice
- currentPosition
- zoneId opzionale

## 2. Seed demo seri ma semplici
Implementa dati seed coerenti e leggibili per:
- 1 customer demo
- 6-8 vehicle demo
- 2-3 fleet zones demo

Usa coordinate plausibili e concentrate nella stessa area, così NearbyVehicles produce risultati sensati.

Se non hai un vincolo geografico preciso, usa coordinate demo consistenti in una singola città e tienile tutte vicine.
Non serve realismo assoluto: serve demo chiara.

## 3. Repository concreti minimi
Implementa davvero i repository necessari a NearbyVehicles.

Minimo richiesto:
- Vehicle repository concreto funzionante
- FleetZone repository concreto funzionante
- GpsTrackingService mock funzionante

Puoi usare:
- in-memory repository ben fatti
oppure
- Drizzle/SQLite se il lavoro resta semplice

Preferenza pratica:
- se SQLite/Drizzle complica troppo, usa in-memory in questo step
- l’importante è avere una slice funzionante e pulita

### IVehicleRepository
Deve avere almeno metodi utili a NearbyVehicles, ad esempio:
- findNearby(position, radiusMeters)
- findById(vehicleId)
- findAll()

### IFleetZoneRepository
Deve avere almeno:
- findAll()
- findById(zoneId)

### IGpsTrackingService
Per questo step può semplicemente:
- restituire la posizione corrente passata dal client
oppure
- simulare una posizione utente se assente

## 4. Logica NearbyVehicles lato API
Implementa davvero:
- NearbyVehicles.types.ts
- NearbyVehicles.handler.ts
- NearbyVehicles.router.ts

### Comportamento richiesto
L’endpoint NearbyVehicles deve:
1. ricevere coordinate utente e raggio
2. recuperare i veicoli
3. filtrare quelli nel raggio richiesto
4. opzionalmente ordinare per distanza crescente
5. restituire un payload pulito e tipizzato

### Nota importante
Per la distanza:
- usa una funzione semplice e leggibile, va benissimo Haversine
- non introdurre librerie geospaziali pesanti
- niente ottimizzazioni premature

### Endpoint
Mantieni o crea un endpoint semplice, ad esempio:
GET /api/vehicles/nearby?lat=...&lng=...&radius=...

oppure POST se già impostato diversamente.
L’importante è che sia coerente e semplice da usare dal frontend.

## 5. Composition root
Aggiorna il composition root in modo che NearbyVehicles usi davvero:
- vehicleRepository concreto
- fleetZoneRepository concreto
- gpsTrackingService concreto/mock

Mantieni il container leggibile.

## 6. Frontend NearbyVehicles funzionante
Implementa davvero lato web:
- NearbyVehicles.types.ts
- NearbyVehicles.hook.ts
- NearbyVehicles.page.tsx

### Hook
Il hook deve:
- chiamare l’endpoint reale NearbyVehicles
- usare TanStack Query
- essere tipizzato
- gestire loading/error in modo pulito

Esempio: useNearbyVehicles(params)

### Page
La pagina deve essere mobile-first e mostrare:
- stato loading con skeleton
- stato errore
- empty state
- lista card veicoli trovati
- tipo veicolo
- distanza
- batteria/stato
- CTA verso dettaglio veicolo, anche se la route dettaglio è ancora placeholder

## 7. Geolocalizzazione frontend
Implementa geolocalizzazione pragmatica e robusta.

Comportamento:
- prova a usare navigator.geolocation
- se l’utente nega o fallisce, usa coordinate fallback statiche
- mostra chiaramente che si stanno usando coordinate demo/fallback se necessario

Non bloccare la UX se la geolocalizzazione fallisce.

## 8. UI constraints
- mobile-first
- card semplici con shadcn/ui
- design sobrio e realistico
- niente mappe reali in questo step
- niente GeoJSON in questo step
- niente librerie mapping per ora
- concentrazione sulla slice NearbyVehicles, non sulla visualizzazione cartografica

## 9. Cleanup delle altre slice
Non implementare davvero le altre slice.
Al massimo:
- assicurati che i loro placeholder continuino a compilare
- non aggiungere logica reale fuori da NearbyVehicles

## 10. README
Aggiorna il README con:
- cosa è stato implementato davvero
- come testare NearbyVehicles
- endpoint disponibile
- eventuale fallback geolocation
- TODO del prossimo step: VehicleDetails

## 11. Output finale atteso
Quando hai finito:
1. mostra i file modificati principali;
2. spiega brevemente le scelte fatte;
3. indica se hai usato in-memory o SQLite;
4. mostra come provare NearbyVehicles in locale;
5. segnala eventuali TODO per il prossimo prompt.

Importante:
- non introdurre mappe
- non introdurre GeoJSON
- non introdurre nuove dipendenze pesanti
- non implementare ancora BookVehicle
- non implementare ancora UnlockVehicle
- non implementare ancora EndRide