Implementa la nuova slice "Profile" per il nostro MVP vehicle sharing, seguendo rigorosamente la Vertical Slice Architecture già presente nel monorepo.

Contesto verificato:
- monorepo Turborepo
- frontend: apps/web
- backend: apps/api
- shared kernel / contratti: packages/contracts
- frontend stack: Next.js 14 App Router, React, Tailwind, shadcn/ui, TanStack Query
- backend stack: Express + TypeScript
- database: SQLite + Drizzle ORM
- utente demo attuale: u1
- la navbar/bottom nav contiene già il tab Profile che punta a /profile
- Graphify ha confermato assenza di import cycles
- DrizzleUserRepository esiste ma al momento è stub/incompleto
- non esiste ancora auth reale: il progetto usa per ora il demo user u1

Vincoli architetturali non negoziabili:
1. Nessun import tra slice.
2. La slice backend deve rispettare il pattern:
   - Profile.types.ts
   - Profile.handler.ts
   - Profile.router.ts
3. Il router Express deve fare solo lavoro HTTP:
   - leggere query/body/params
   - validare input base
   - chiamare l’handler
   - tradurre l’output in response JSON
4. L’handler NON deve dipendere da Express Request/Response:
   - deve essere una funzione applicativa pura creata con createProfileHandler(deps)
   - deve accettare un input tipizzato
   - deve restituire un output tipizzato
5. Le dipendenze concrete devono essere risolte nel composition root.
6. Usa Graphify all’inizio e alla fine per verificare che la nuova slice non introduca coupling scorretto.

Obiettivo MVP:
Creare la pagina Profilo per completare la navbar. La pagina deve essere read-only e mostrare i dati dell’utente demo corrente.

Decisioni MVP già prese:
- NO editing profilo in questa iterazione
- NO statistiche corse in questa iterazione
- SI fetch del profilo usando userId=u1, coerente con il resto dell’MVP
- SI eventuale sezione pagamenti solo informativa/placeholder, senza implementare ManagePaymentMethod

Task da eseguire:

1. Esplorazione rapida iniziale
- Usa Graphify per confermare:
  - path reali da modificare
  - convenzioni di naming
  - punto esatto in cui la navbar usa /profile
  - pattern delle altre slice frontend/backend
- Non fare assunzioni su path o nomi file se non verificati.

2. Backend - slice Profile
Implementa una nuova slice backend `Profile` coerente con le altre.

Requisiti:
- `Profile.types.ts` deve contenere almeno:
  - input della slice (es. get current profile)
  - output della slice
  - deps della slice con `userRepo: IUserRepository`
- `Profile.handler.ts` deve:
  - esportare `createProfileHandler(deps)`
  - ricevere un input tipizzato (non req/res)
  - usare `deps.userRepo.findById`
  - restituire un output tipizzato
  - gestire user non trovato con un errore coerente ai pattern esistenti
- `Profile.router.ts` deve:
  - esportare `createProfileRouter(deps)`
  - registrare endpoint GET coerente con la codebase
  - leggere `userId` dalla query se questo è il pattern MVP già usato nel progetto
  - chiamare l’handler e restituire JSON

3. Repository utente
Completa `DrizzleUserRepository` nei metodi necessari per supportare la slice Profile:
- implementa almeno `findById`
- implementa anche `findByEmail` solo se semplice e coerente
- non introdurre funzionalità non richieste
- mappa i dati DB verso il tipo/domain model realmente usato nel progetto

4. Wiring backend
- registra le dipendenze nel composition root
- monta il router nell’app Express nel punto corretto
- mantieni coerenza con le altre slice già presenti

5. Frontend - slice Profile
Implementa la slice frontend `Profile` con i file:
- `Profile.types.ts`
- `Profile.hook.ts`
- `Profile.page.tsx`

Requisiti:
- hook `useProfile()` con TanStack Query
- fetch verso l’endpoint profile usando l’utente demo `u1`
- UI mobile-first, semplice e coerente con il resto dell’MVP
- usa `AppLayout` e imposta la nav attiva correttamente su `/profile`
- gestisci loading, error e empty state
- riusa componenti UI già presenti (`card`, `badge`, `skeleton`, `separator`, ecc.) quando appropriato

Contenuto minimo della pagina:
- intestazione "Profilo"
- email utente
- ruolo
- data registrazione
- eventuali altri campi realmente disponibili senza inventarli
- sezione "Pagamenti" come placeholder informativo se non esiste ancora la relativa slice
- eventuale indicazione discreta che si tratta di account demo, solo se coerente con il resto della UI

6. Next.js route
- crea o completa la route `apps/web/src/app/profile/page.tsx`
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
5. eventuali TODO espliciti per le prossime feature "Storico" e "Ricerca"

Importante:
- non implementare editing
- non aggiungere statistiche rides
- non creare accoppiamenti con altre slice
- non inventare campi utente che non esistono davvero in schema/mapper reali
- se trovi ambiguità bloccanti, fermati e produci una lista di domande precise invece di improvvisare