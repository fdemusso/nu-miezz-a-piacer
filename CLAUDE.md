# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the repo root (Turborepo orchestrates the workspaces):

- `npm run dev` — runs `dev` in every workspace in parallel (Vite on web, `tsx watch` on api).
- `npm run build` — type-checks + builds (`tsc -b && vite build` for web, `tsc` for api).
- `npm run lint` — runs `eslint .` in workspaces that define `lint` (currently only `apps/web`).

Per-app (when iterating on just one):

- Web only: `npm run dev -w @nu-miezz-a-piacer/web` (Vite dev server on `:5173`, proxies `/api` to `:3001`).
- API only: `npm run dev -w @nu-miezz-a-piacer/api` (Express on `:3001`, override via `PORT`).
- API production: `npm run build -w @nu-miezz-a-piacer/api && npm run start -w @nu-miezz-a-piacer/api`.

There is no test runner configured in any workspace — do not invent test commands.

Package manager is `npm@11.9.0` (see `package.json` `packageManager` field). Use npm, not pnpm/yarn.

## Architecture

This is a **Vertical Slice Architecture (VSA)** monorepo for a shared-mobility platform ("nu miezz a piacer"). The big picture only makes sense if you understand how the three workspaces relate.

### Workspaces

- `apps/api` — Express + TypeScript backend.
- `apps/web` — React 19 + Vite + react-router-dom v7 frontend.
- `packages/contracts` (`@vsa/contracts`) — shared domain types, repository/service interfaces, and the **slice registry**. Imported by both apps via the npm workspace alias; exports `./src/index.ts` directly (no build step).

### Slices are the unit of organization

Both apps mirror the same set of ~32 slices under `src/slices/<SliceName>/`. A slice is one user-facing capability (e.g. `BookVehicle`, `NearbyVehicles`, `EndRide`). Each slice owns its files end-to-end:

- **API slice**: `<Name>.types.ts` (request/response shape), `<Name>.handler.ts` (pure function `makeXHandler(deps) => async (req) => res`, deps are interfaces from `@vsa/contracts`), `<Name>.router.ts` (Express router that wires `container.<slice>` into the handler and mounts the route).
- **Web slice**: `<Name>.types.ts` (view-state types), `<Name>.hook.ts` (the React hook `useX()` returning a view model), `<Name>.page.tsx` (presentational component consuming the hook).

When adding a new slice, create the folder in **both** apps (if user-facing) and the slice keys in `packages/contracts/src/sliceRegistry.ts` with the allowed roles (`customer | operator | admin`). The registry is the source of truth for which slices a given role can see.

### Composition root (API)

`apps/api/src/composition/container.ts` is the single place that instantiates concrete adapters (`Sqlite*Repository`, `*Service` classes from `apps/api/src/adapters/`) and assembles the per-slice dependency bundle. Each slice's router imports `container.<sliceName>` and passes it to the handler factory. **Handlers never `new` an adapter** — they depend only on interfaces declared in `@vsa/contracts`.

Adding a new repository or service: define the interface in `packages/contracts/src/index.ts`, add the concrete class under `apps/api/src/adapters/` (re-exported from `repositories.ts` / `services.ts`), then wire it into `container.ts`.

### Wiring a new endpoint

1. Add slice folder `apps/api/src/slices/<Name>/` with the three files described above.
2. Add a key for the slice in `container.ts` that bundles the deps it needs.
3. Import the new router in `apps/api/src/app.ts` and mount it under `app.use('/api', ...)`.

### Web routing

`apps/web/src/App.tsx` defines the React Router tree. All routes render inside `<AppLayout />` (which provides the `BottomNav`). Only a subset of slices currently have pages wired into routes — most slice folders exist as scaffolds. The Vite dev server proxies `/api/*` to the API on `:3001`, so web code should call `/api/...` directly without a base URL.

### Domain glossary

Core types live in `packages/contracts/src/index.ts`: `Vehicle`, `Booking`, `Ride`, `ZoneRule`, `FleetZone`, etc. Roles are `customer | operator | admin`. Vehicle types are `scooter | bike | ebike | car`. Zone types are `parking | forbidden | sensitive | incentive`.

## Project context

`sprint/` contains sprint planning notes (Italian) — useful for understanding scope of in-progress work. `studio migrazione VSA.md` documents the migration to VSA. `ClassDiagram.svg` shows the domain model.
