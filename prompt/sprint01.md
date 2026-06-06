Voglio inizializzare da zero un progetto MVP di vehicle sharing con architettura Vertical Slice Architecture (VSA), in monorepo Turborepo, con focus mobile-first.

Obiettivo di questo step:
creare SOLO la base del progetto, senza implementare ancora la business logic completa delle slice.
Non voglio funzionalità finali adesso: voglio uno scaffold pulito, coerente e pronto per i prompt successivi.

### Scelte tecniche obbligatorie
- Monorepo con Turborepo
- TypeScript ovunque
- Frontend: Next.js (App Router) + React + Tailwind CSS
- UI library: shadcn/ui
- Stato server: TanStack Query
- Stato client leggero: Zustand
- Form: react-hook-form + zod
- Backend: Node.js + TypeScript + Express
- Database locale MVP: SQLite
- Query builder / ORM: Drizzle ORM con SQLite
- Shared package per contratti e modelli: packages/contracts
- Package separato opzionale per config/types shared: packages/config
- Linting e formatting: ESLint + Prettier
- Dev experience: pnpm
- Naming coerente e professionale

### Vincoli architetturali da rispettare
Segui rigorosamente questa impostazione VSA:
- apps/web contiene il frontend React/Next
- apps/api contiene il backend Express
- packages/contracts contiene enum, value object, interfacce repository/service, tipi condivisi
- ogni slice vive in una cartella autonoma
- nessuna slice può importare un’altra slice
- web e api possono dipendere solo da packages/contracts per i tipi condivisi
- gli adapter concreti lato backend devono stare fuori dalle slice, in un’area adapters
- il wiring delle dipendenze deve stare in un composition root lato api
- il frontend deve essere organizzato per slice, con convenzioni tipo:
  - apps/web/src/slices/NearbyVehicles/NearbyVehicles.page.tsx
  - apps/web/src/slices/NearbyVehicles/NearbyVehicles.hook.ts
  - apps/web/src/slices/NearbyVehicles/NearbyVehicles.types.ts
- il backend deve essere organizzato per slice, con convenzioni tipo:
  - apps/api/src/slices/BookVehicle/BookVehicle.router.ts
  - apps/api/src/slices/BookVehicle/BookVehicle.handler.ts
  - apps/api/src/slices/BookVehicle/BookVehicle.types.ts

### Scope MVP da supportare nei prossimi prompt
Prepara il progetto per queste slice utente:
- NearbyVehicles
- VehicleDetails
- BookVehicle
- UnlockVehicle
- EndRide

Non implementarle ancora davvero.
Voglio solo che la base del progetto sia pronta ad accoglierle.

### Cosa deve fare adesso
1. Inizializza il monorepo con pnpm workspaces e turborepo.
2. Crea la struttura directory completa minima ma già sensata:
   - apps/web
   - apps/api
   - packages/contracts
   - packages/config (se utile)
3. Configura TypeScript con path puliti e compatibili col monorepo.
4. Configura Next.js app router nel frontend.
5. Configura Tailwind.
6. Installa e configura shadcn/ui.
7. Aggiungi alcuni componenti base shadcn già pronti:
   - button
   - card
   - badge
   - input
   - sheet
   - dialog
   - tabs
   - separator
   - skeleton
8. Configura TanStack Query nel frontend.
9. Configura Zustand nel frontend.
10. Crea un layout mobile-first per il frontend, pulito e minimale, con:
   - header semplice
   - bottom navigation placeholder
   - safe area spacing
   - container max width tipo app mobile
11. Crea una homepage placeholder in apps/web che elenca le slice MVP come card.
12. Configura Express lato api con:
   - app.ts
   - server.ts
   - health route
   - struttura slices vuota
   - composition root vuota ma pronta
13. Configura Drizzle con SQLite lato api, ma senza schema finale completo.
   Crea solo il bootstrap iniziale e una cartella db.
14. In packages/contracts crea i tipi minimi iniziali coerenti col dominio:
   - enum UserRole
   - enum VehicleType
   - enum VehicleStatus
   - enum RideStatus
   - enum BookingStatus
   - interface Coordinates
   - interface Money
   - interface VehicleSpecs
   - interface VehicleFeatures
   - interface PricingPlan
   - interface BatteryInfo
   - interface Vehicle
   - interface Booking
   - interface Ride
   - interface IUserRepository
   - interface IVehicleRepository
   - interface IBookingRepository
   - interface IRideRepository
   - interface IUnlockService
   - interface IZoneValidator
   - interface IBillingService
15. Esporta bene tutto da packages/contracts.
16. Aggiungi script root utili:
   - dev
   - build
   - lint
   - typecheck
17. Fai in modo che `pnpm install` e poi `pnpm dev` siano il più possibile pronti a partire.
18. Crea un README breve ma utile con:
   - struttura repo
   - come avviare
   - convenzioni VSA
   - prossimi step

### Requisiti di qualità
- Niente overengineering.
- Codice pulito e minimale.
- Nessuna logica di business inventata se non necessaria.
- Nessun import circolare.
- Nessuna slice che dipende da un’altra.
- UI mobile-first, sobria, moderna, non “template da dashboard admin”.
- Usa shadcn in modo semplice e realistico.
- Se serve, crea componenti shared solo per layout/base UI, non per mescolare le responsabilità delle slice.
- Commenta solo dove è davvero utile.
- Se una scelta è dubbia, preferisci la soluzione più semplice da estendere nei prompt successivi.

### Output atteso
Voglio che tu:
1. crei tutti i file necessari;
2. mostri l’albero finale delle cartelle;
3. spieghi in modo sintetico le scelte fatte;
4. evidenzi eventuali TODO importanti per i prompt successivi.

Importante:
- non implementare ancora le slice MVP
- non creare autenticazione
- non creare mappe reali
- non collegare servizi esterni
- non creare UI desktop-first
- non aggiungere librerie non necessarie