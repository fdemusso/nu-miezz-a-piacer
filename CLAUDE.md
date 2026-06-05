# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start all apps (web :3000, api :3001)
pnpm build        # build all
pnpm lint         # lint all
pnpm typecheck    # typecheck all
pnpm format       # prettier write

# API only
cd apps/api && pnpm dev
cd apps/api && npx drizzle-kit generate
cd apps/api && npx drizzle-kit push
```

## Project overview

MVP di una piattaforma di vehicle sharing costruita con Vertical Slice Architecture (VSA).

### Stack
- Monorepo: Turborepo + pnpm
- Frontend: Next.js + React + TypeScript + Tailwind + shadcn/ui
- Backend: Express + TypeScript
- Shared contracts: `packages/contracts`
- Data layer: SQLite / Drizzle oppure implementazioni in-memory quando più pragmatiche per il MVP

## Current MVP scope

Le sole slice attualmente in scope sono:
- NearbyVehicles
- VehicleDetails
- BookVehicle
- UnlockVehicle
- EndRide

Ordine di implementazione:
1. NearbyVehicles
2. VehicleDetails
3. BookVehicle
4. UnlockVehicle
5. EndRide

Lavorare **una slice end-to-end alla volta**.  
Non implementare più slice insieme se non esplicitamente richiesto.

## Repository structure

- `apps/web`: frontend Next.js
- `apps/api`: backend Express
- `packages/contracts`: tipi condivisi, enum, value object, interfacce repository/service
- `packages/config`: config condivisa leggera

## VSA rules

Queste regole sono **non negoziabili**:

1. Ogni slice è autonoma.
2. Nessuna slice può importare un’altra slice.
3. `apps/web` e `apps/api` possono condividere tipi solo tramite `packages/contracts`.
4. Gli adapter concreti devono stare fuori dalle slice.
5. Il wiring delle dipendenze deve stare in un composition root unico lato API.
6. Le slice dipendono da contratti/interfacce, mai da implementazioni concrete.
7. Le implementazioni concrete di repository e services vivono in `apps/api/src/adapters`.
8. Nessuna dipendenza circolare.

## Slice conventions

### API slice structure
Ogni slice backend deve seguire questo pattern:
- `SliceName.types.ts`
- `SliceName.handler.ts`
- `SliceName.router.ts`

Responsabilità:
- `types`: input/output della slice
- `handler`: logica applicativa della slice, con dipendenze iniettate
- `router`: parsing HTTP, chiamata al handler, risposta HTTP

Il router **non** contiene business logic.  
Il handler **non** istanzia repository o servizi concreti.

### Web slice structure
Ogni slice frontend deve seguire questo pattern:
- `SliceName.types.ts`
- `SliceName.hook.ts`
- `SliceName.page.tsx`

Responsabilità:
- `types`: tipi locali della slice lato frontend
- `hook`: query/mutation verso API
- `page`: UI della slice

## Coding priorities

Quando implementi nuove feature:
1. preserva i confini architetturali;
2. preferisci soluzioni semplici e demo-friendly;
3. evita refactor ampi se non richiesti;
4. completa prima il flusso minimo funzionante;
5. migliora solo dopo che la slice compila, gira e si può dimostrare.

## UI/UX rules

- Sempre mobile-first
- UI sobria, semplice, realistica
- Nessuna dashboard admin
- Nessuna sidebar desktop-first
- Usare shadcn/ui in modo pragmatico
- Preferire card, CTA chiare, spacing pulito, bottom actions quando utile

## Geo rules

Per ora:
- niente mappe reali
- niente GeoJSON custom
- niente librerie geospaziali pesanti
- usare coordinate semplici, fallback statici e distanza calcolata in modo leggero

Il focus iniziale è il comportamento della slice, non la visualizzazione cartografica.

## Data and infrastructure rules

- Per il MVP preferire implementazioni semplici e affidabili
- In-memory va bene se accelera la demo senza rompere l’architettura
- SQLite/Drizzle va bene quando aggiunge valore reale e non rallenta inutilmente
- Nessun servizio esterno reale per unlock, billing, notifiche o geozone in questa fase
- Per questi casi usare mock service coerenti con i contratti

## Current non-goals

Non implementare per ora:
- autenticazione
- ruoli Operator o PublicAdministration
- promozioni
- support ticket
- reporting
- maintenance workflow
- heatmap o mappe avanzate
- zone rules complesse
- ottimizzazioni premature
- refactor globali non richiesti

## Do not

Non fare queste cose:
- non introdurre dipendenze tra slice
- non mettere repository concreti dentro le slice
- non spostare tipi condivisi fuori da `packages/contracts`
- non aggiungere nuove librerie senza necessità reale
- non ampliare lo scope MVP senza richiesta esplicita
- non rifare la struttura esistente se non è necessario
- non trasformare placeholder di slice future in implementazioni parziali confuse
- non mescolare logica HTTP, business logic e persistence nello stesso file

## Implementation style

- Codice chiaro e minimale
- Tipi espliciti
- Nomi coerenti con il dominio
- Commenti solo se utili
- Nessun overengineering
- Se una scelta è dubbia, scegliere la soluzione più semplice che preserva la VSA

## Working mode for future prompts

Quando ricevi un task:
1. tocca solo i file necessari;
2. non ricreare struttura già esistente;
3. mantieni compilazione e typecheck puliti;
4. segnala chiaramente TODO e semplificazioni MVP;
5. implementa una sola slice completa per volta, salvo istruzioni diverse.