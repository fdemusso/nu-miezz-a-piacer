Devi implementare la nuova feature "Search" / "Ricerca" per il nostro MVP vehicle sharing, seguendo rigorosamente la Vertical Slice Architecture già presente nel monorepo.

Contesto verificato:
- monorepo Turborepo
- frontend: apps/web
- backend: apps/api
- shared kernel / contratti: packages/contracts
- frontend stack: Next.js 14 App Router, React, Tailwind, shadcn/ui, TanStack Query
- backend stack: Express + TypeScript
- database: SQLite + Drizzle ORM
- utente demo attuale: u1
- Graphify ha confermato assenza di import cycles
- esiste già la slice NearbyVehicles per ricerca geografica dei mezzi disponibili vicini
- IVehicleRepository oggi copre lookup by id, nearby, zone e findAll, ma non una ricerca filtrata esplicita
- le slice non possono importarsi tra loro e possono dipendere solo da contratti condivisi

Obiettivo MVP:
Creare la pagina Ricerca per permettere all’utente di trovare rapidamente veicoli rilevanti tramite una ricerca semplice e mobile-first.

Prima decisione obbligatoria:
1. Usa Graphify e l’esplorazione della codebase per decidere se:
   - creare una nuova slice autonoma `Search`, oppure
   - estendere NearbyVehicles in modo coerente senza rompere la VSA
2. Non improvvisare: argomenta la scelta in base alla topologia reale della codebase.
3. Se NearbyVehicles è troppo legata alla geolocalizzazione e alla mappa/lista “nearby”, preferisci una slice autonoma `Search`.

Decisioni MVP già fissate:
- SI ricerca semplice
- NO motore di ricerca avanzato
- NO full-text complesso
- SI filtri leggeri se semplici: tipo veicolo e stato disponibile
- SI possibilità di cercare per testo se esiste un campo sensato come plate/code, brand o model
- SI UI mobile-first
- NO accoppiamento con altre slice
- NO ottimizzazioni premature

Vincoli architetturali non negoziabili:
1. Nessun import tra slice.
2. Se scegli una nuova slice backend, deve rispettare il pattern:
   - Search.types.ts
   - Search.handler.ts
   - Search.router.ts
3. Il router Express deve fare solo lavoro HTTP:
   - leggere query/body/params
   - validare input base
   - chiamare l’handler
   - tradurre l’output in response JSON
4. L’handler NON deve dipendere da Express Request/Response:
   - deve essere una funzione applicativa pura creata con createSearchHandler(deps)
   - deve accettare un input tipizzato
   - deve restituire un output tipizzato
5. Le dipendenze concrete devono essere risolte nel composition root.
6. Usa Graphify all’inizio e alla fine per verificare che la soluzione non introduca coupling scorretto.

Task da eseguire:

1. Esplorazione e decisione architetturale
- Usa Graphify per confermare:
  - path reali da modificare
  - convenzioni di naming
  - punto esatto in cui la navbar usa /search, se già presente
  - relazione tra NearbyVehicles e una potenziale feature di ricerca
- Produci una decisione breve:
  - "nuova slice Search" oppure
  - "estensione coerente di NearbyVehicles"
- Se scegli estensione, spiega come mantieni i confini VSA e non mescoli responsabilità incompatibili.

2. Contratti / repository
Se serve supporto lato backend:
- estendi `IVehicleRepository` solo quanto basta per supportare la ricerca MVP
- esempio: un metodo tipo `search(...)` o `findByFilters(...)`, ma scegli il naming in base alle convenzioni reali del progetto
- evita contratti troppo generici o troppo enterprise
- implementa il metodo nel repository concreto usato oggi dal backend

3. Backend
Se la decisione architetturale porta a una nuova slice:
- implementa `Search.types.ts`
- implementa `Search.handler.ts`
- implementa `Search.router.ts`
- monta la route nel backend
- fai wiring nel composition root

Se invece la decisione è estendere NearbyVehicles:
- modifica solo i punti strettamente necessari
- non sporcare la slice con responsabilità non coerenti
- mantieni handler/router puliti e input/output ben tipizzati

4. Frontend
Implementa la pagina Ricerca con UI semplice e chiara.

Requisiti:
- route `/search` se coerente con la navbar
- input di ricerca
- eventuali filtri leggeri: tipo veicolo, solo disponibili
- lista risultati
- loading, error, empty state
- mobile-first
- riuso di componenti UI già presenti
- AppLayout con nav attiva corretta

Risultati da mostrare se disponibili nei dati reali:
- tipo veicolo
- plate/code o identificatore visibile
- brand/model se esistono
- stato
- batteria/autonomia se già disponibili facilmente e senza coupling improprio
- eventuale CTA verso dettaglio veicolo se esiste già la route di VehicleDetails

5. Verifica finale
Alla fine:
- usa Graphify per controllare che non ci siano import cross-slice
- verifica che backend e frontend dipendano solo dai contratti condivisi dove previsto
- assicurati che la soluzione sia coerente con i confini di responsabilità già emersi nella codebase

Output finale richiesto:
1. decisione architetturale presa e motivazione
2. elenco file creati/modificati
3. sintesi delle scelte implementative
4. eventuali assunzioni fatte
5. check architetturale finale basato su Graphify
6. TODO residui per evoluzioni future della ricerca

Importante:
- non inventare campi inesistenti
- non creare un motore di ricerca sofisticato
- non introdurre full-text o ranking complesso
- non fare import tra slice
- se trovi ambiguità bloccanti, fermati e produci una lista di domande precise invece di improvvisare