Devi implementare la nuova slice "History" / "Storico" per il nostro MVP vehicle sharing, seguendo rigorosamente la Vertical Slice Architecture già presente nel monorepo.

Contesto verificato:
- monorepo Turborepo
- frontend: apps/web
- backend: apps/api
- shared kernel / contratti: packages/contracts
- frontend stack: Next.js 14 App Router, React, Tailwind, shadcn/ui, TanStack Query
- backend stack: Express + TypeScript
- database: SQLite + Drizzle ORM
- utente demo attuale: u1
- la navbar/bottom nav contiene già il tab History o va completato in coerenza con la route /history
- Graphify ha confermato assenza di import cycles
- il dominio ha già Ride, RideSummary, Booking, Vehicle, Customer e repository correlati
- attualmente IRideRepository espone findById e findActiveByUser, ma non una query completa per lo storico delle corse dell’utente

Obiettivo MVP:
Creare la pagina Storico per mostrare all’utente demo l’elenco delle corse concluse o comunque il suo storico corse, in modo semplice, mobile-first e coerente con l’MVP.
La pagina deve essere read-only.

Vincoli architetturali non negoziabili:
1. Nessun import tra slice.
2. La slice backend deve rispettare il pattern:
   - History.types.ts
   - History.handler.ts
   - History.router.ts
3. Il router Express deve fare solo lavoro HTTP:
   - leggere query/body/params
   - validare input base
   - chiamare l’handler
   - tradurre l’output in response JSON
4. L’handler NON deve dipendere da Express Request/Response:
   - deve essere una funzione applicativa pura creata con createHistoryHandler(deps)
   - deve accettare un input tipizzato
   - deve restituire un output tipizzato
5. Le dipendenze concrete devono essere risolte nel composition root.
6. Usa Graphify all’inizio e alla fine per verificare che la nuova slice non introduca coupling scorretto.

Decisioni MVP già fissate:
- NO editing
- NO filtri avanzati complessi iniziali
- SI elenco dello storico corse
- SI route frontend /history
- SI uso dell’utente demo u1 come nel resto dell’MVP
- SI dettaglio minimo di ogni corsa: data/ora, veicolo, durata, costo finale, stato
- opzionale: CTA o link verso il dettaglio corsa se esiste una slice/route coerente, ma non introdurre complessità inutile

Task da eseguire:

1. Esplorazione rapida iniziale
- Usa Graphify per confermare:
  - path reali da modificare
  - convenzioni di naming
  - punto esatto in cui la navbar usa /history
  - pattern delle slice frontend/backend già presenti
  - eventuale slice o route esistente collegata a RideSummary o storico corse
- Non fare assunzioni su path o nomi file se non verificati.

2. Backend - slice History
Implementa una nuova slice backend `History` coerente con le altre.

Requisiti:
- `History.types.ts` deve contenere almeno:
  - input della slice
  - output della slice
  - deps della slice con `rideRepo: IRideRepository`
- `History.handler.ts` deve:
  - esportare `createHistoryHandler(deps)`
  - ricevere un input tipizzato (non req/res)
  - usare `deps.rideRepo` per recuperare lo storico corse dell’utente demo
  - restituire un output tipizzato con una lista di corse
  - gestire eventuale user non trovato o storia vuota con errori/stati coerenti ai pattern esistenti
- `History.router.ts` deve:
  - esportare `createHistoryRouter(deps)`
  - registrare un endpoint GET coerente con la codebase
  - leggere `userId` dalla query se questo è il pattern MVP già usato nel progetto
  - chiamare l’handler e restituire JSON

3. Repository ride
Estendi `IRideRepository` solo quanto basta per supportare lo storico.
- aggiungi un metodo di lettura per corse per utente, ad esempio paginato o completo, in base al pattern reale della codebase
- implementa il metodo nel repository concreto usato dal backend
- non introdurre query inutili o sovradimensionate
- mappa i dati in modo coerente con il domain model già esistente

4. Wiring backend
- registra le dipendenze nel composition root
- monta il router nell’app Express nel punto corretto
- mantieni coerenza con le altre slice già presenti

5. Frontend - slice History
Implementa la slice frontend `History` con i file:
- `History.types.ts`
- `History.hook.ts`
- `History.page.tsx`

Requisiti:
- hook `useHistory()` con TanStack Query
- fetch verso l’endpoint history usando l’utente demo `u1`
- UI mobile-first, semplice e coerente con il resto dell’MVP
- usa `AppLayout` e imposta la nav attiva correttamente su `/history`
- gestisci loading, error e empty state
- riusa componenti UI già presenti quando appropriato

Contenuto minimo della pagina:
- intestazione "Storico"
- lista delle corse con data/ora, veicolo, durata, costo, stato
- stato vuoto ben disegnato se non ci sono corse
- eventuale accesso al riepilogo corsa se già esiste un pattern coerente
- nessun grafico o filtro avanzato in questa iterazione

6. Next.js route
- crea o completa la route `apps/web/src/app/history/page.tsx`
- mantienila come wrapper sottile che renderizza il componente page della slice

7. Verifica finale
Alla fine:
- usa Graphify per controllare che non ci siano import cross-slice
- verifica che la nuova slice si inserisca nella topologia esistente
- controlla che backend e frontend dipendano solo dai contratti condivisi dove previsto

Output finale richiesto:
1. elenco file creati/modificati
2. sintesi delle scelte implementative
3. eventuali assunzioni fatte
4. check architetturale finale basato su Graphify
5. eventuali TODO espliciti per la prossima slice "Ricerca"

Importante:
- non introdurre editing
- non inventare campi o metriche che non esistono nel dominio
- non creare accoppiamenti con altre slice
- non aggiungere complessità inutile
- se trovi ambiguità bloccanti, fermati e produci una lista di domande precise invece di improvvisare