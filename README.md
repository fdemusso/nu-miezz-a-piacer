# Vehicle Sharing MVP

Mobile-first vehicle sharing app. Vertical Slice Architecture in a Turborepo monorepo.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + React + Tailwind + shadcn/ui |
| State server | TanStack Query |
| State client | Zustand |
| Forms | react-hook-form + zod |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite via Drizzle ORM |
| Shared types | `@mvp/contracts` |
| Monorepo | Turborepo + pnpm workspaces |

## Repo structure

```
mvp/
├── apps/
│   ├── web/              # Next.js frontend (port 3000)
│   │   └── src/
│   │       ├── app/          # Next.js App Router
│   │       ├── slices/       # One folder per VSA slice
│   │       ├── components/
│   │       │   ├── ui/       # shadcn components
│   │       │   └── layout/   # AppLayout, Header, BottomNav
│   │       ├── lib/          # utils, api client, query-client
│   │       ├── stores/       # Zustand stores
│   │       └── providers/    # AppProviders (QueryClient)
│   └── api/              # Express backend (port 3001)
│       └── src/
│           ├── slices/       # One folder per VSA slice
│           ├── adapters/     # Concrete repo/service implementations
│           ├── db/           # Drizzle schema + bootstrap
│           ├── shared/       # Middleware, error handler
│           ├── composition-root.ts  # Wires adapters → slices
│           ├── app.ts        # Express app factory
│           └── server.ts     # Entry point
└── packages/
    ├── contracts/        # Enums, types, repository/service interfaces
    └── config/           # Shared constants, env helpers
```

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env files
cp apps/api/.env.example apps/api/.env

# 3. Start all apps in dev mode
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001
- Health: http://localhost:3001/health

## VSA conventions

Each slice is self-contained. No cross-slice imports.

**Frontend slice** (`apps/web/src/slices/<SliceName>/`):
- `<Slice>.page.tsx` — React component (route entry point)
- `<Slice>.hook.ts` — data-fetching / mutation logic (TanStack Query)
- `<Slice>.types.ts` — local types, can re-export from `@mvp/contracts`

**Backend slice** (`apps/api/src/slices/<SliceName>/`):
- `<Slice>.router.ts` — Express Router, declares routes
- `<Slice>.handler.ts` — request handler, returns factory that accepts deps
- `<Slice>.types.ts` — request/response types + deps interface

**Rules:**
- Slices depend only on `@mvp/contracts`, never on each other
- Concrete adapters live in `apps/api/src/adapters/`
- Dependency injection happens only in `composition-root.ts`

## MVP slices

| Slice | Frontend | API |
|---|---|---|
| NearbyVehicles | `GET /` | `GET /api/vehicles/nearby` |
| VehicleDetails | `GET /vehicles/:id` | `GET /api/vehicles/:vehicleId` |
| BookVehicle | `POST /book/:vehicleId` | `POST /api/bookings` |
| UnlockVehicle | `POST /unlock/:bookingId` | `POST /api/rides/unlock` |
| EndRide | `POST /ride/:rideId/end` | `POST /api/rides/:rideId/end` |

## Next steps (TODO)

- [ ] Wire Next.js routes to slice pages (`app/vehicles/[id]/page.tsx` etc.)
- [ ] Implement Drizzle repository methods (currently stub)
- [ ] Run `drizzle-kit generate` + `drizzle-kit push` to bootstrap DB
- [ ] Add geolocation to NearbyVehicles (browser API)
- [ ] Add map component to NearbyVehicles (e.g. Mapbox GL or Leaflet)
- [ ] Replace `MockUnlockService` with real IoT adapter
- [ ] Add auth (JWT middleware — not yet in scope)
- [ ] Add `NEXT_PUBLIC_API_URL` to `apps/web/.env.local`
