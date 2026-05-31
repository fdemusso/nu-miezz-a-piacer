# Sprint 0 — Fondamenta

**Obiettivo:** rendere il progetto eseguibile end-to-end con stato persistente e test ripetibili, prima di scrivere logica.

**Durata indicativa:** 5 giorni.

## Task

### 0.1 Boot dell'API
- Aggiungere uno script `apps/api/src/main.ts` che importa `app` da `./app` e fa `listen(3000)`.
- Aggiungere `"dev": "tsx watch src/main.ts"` in `apps/api/package.json`.
- Endpoint `/health` sotto un router dedicato `apps/api/src/slices/Health/Health.router.ts` (è una micro-slice di sistema, segue la convenzione).

### 0.2 Persistenza reale
- Aggiungere `better-sqlite3` come dep di `apps/api`.
- Creare `apps/api/src/adapters/db.ts`: apre `data/dev.sqlite`, espone una funzione `getDb()` con migrazioni inline (tabelle `users`, `vehicles`, `bookings`, `rides`, `zones`, `fleet_zones`).
- Trasformare ciascun `Sqlite*Repository` in due classi nel solito file: la versione `InMemory*Repository` resta come default per i test; la `Sqlite*Repository` reale usa `getDb()`. Il container sceglie in base a `process.env.DB_BACKEND` (`memory` | `sqlite`, default `memory`).
- Mantenere le firme dei repo identiche — nessuna slice deve cambiare.

### 0.3 Seed dev
- `apps/api/src/seed.ts`: popola 5 veicoli, 3 zone, 1 customer, 1 operator, 1 admin.
- Comando `pnpm --filter api seed`.

### 0.4 DI pulita
- Estrarre il tipo `Container` (oggi inferito) in `apps/api/src/composition/types.ts`.
- I router prendono `container` da una factory: `export function makeBookVehicleRouter(deps: Container['bookVehicle'])` invece di importare `container` globale.
- `app.ts` chiama le factory passando le sezioni del container.
  - Beneficio: i test possono iniettare adapter fittizi senza patchare moduli.

### 0.5 Test harness
- Vitest in root, configurato come workspace.
- Convention: ogni slice ha `<Slice>.test.ts` accanto agli altri file.
- Helper `apps/api/src/testing/buildTestContainer.ts` che costruisce un container con repo in-memory e seed deterministico.

### 0.6 Frontend skeleton
- `apps/web` deve già esistere come scaffold. Verificare che ci sia `vite + react` configurato.
- Creare `apps/web/src/api/client.ts`: thin fetch wrapper che condivide i tipi da `@vsa/contracts`.
- Una pagina shell con 3 tab vuote (Customer / Operator / Admin) — verrà popolata negli sprint successivi.

## Definition of Done (Sprint 0)

- `pnpm dev` avvia api e web in parallelo (turbo).
- `curl localhost:3000/api/health` → 200.
- `pnpm test` esegue 0 test ma esce 0 (vitest configurato).
- `DB_BACKEND=sqlite pnpm --filter api seed && pnpm --filter api dev` legge i dati seedati.
- `tsc --noEmit` pulito.
