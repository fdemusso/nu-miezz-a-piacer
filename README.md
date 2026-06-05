# Vehicle Sharing MVP

Mobile-first vehicle sharing app. Vertical Slice Architecture in a Turborepo monorepo.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + React + Tailwind + shadcn/ui |
| State server | TanStack Query |
| State client | Zustand |
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
│   │       └── providers/    # AppProviders (QueryClient)
│   └── api/              # Express backend (port 3001)
│       └── src/
│           ├── slices/       # One folder per VSA slice
│           ├── adapters/     # Concrete repo/service implementations
│           ├── db/           # Drizzle schema + bootstrap + seed
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

# 2. Start all apps in dev mode (DB + seed are auto-initialized on first startup)
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001
- Health: http://localhost:3001/health

> No manual DB migration needed. Tables are created and seed data is inserted automatically on first startup.

## Test NearbyVehicles

```bash
# Start API only
cd apps/api && pnpm dev

# Query nearby vehicles (demo coords: Milan Duomo)
curl "http://localhost:3001/api/vehicles/nearby?lat=45.4654&lng=9.1859&radiusKm=2"
```

Response shape:
```json
{
  "userPosition": { "lat": 45.4654, "lng": 9.1859 },
  "radiusKm": 2,
  "vehicles": [
    {
      "id": "v1",
      "plateOrCode": "EL-001",
      "type": "SCOOTER",
      "status": "AVAILABLE",
      "batteryLevel": 85,
      "distanceMeters": 184,
      "estimatedWalkMinutes": 3,
      "currentPosition": { "lat": 45.467, "lng": 9.1865 }
    }
  ]
}
```

**Frontend geolocation:** the web app tries `navigator.geolocation`. If denied or unavailable, it falls back silently to Milan Duomo coordinates and shows a small banner.

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

## Implemented slices

| Slice | Status | Frontend | API |
|---|---|---|---|
| NearbyVehicles | ✅ Done | `GET /` | `GET /api/vehicles/nearby` |
| VehicleDetails | scaffold | `GET /vehicles/:id` | `GET /api/vehicles/:vehicleId` |
| BookVehicle | scaffold | `POST /book/:vehicleId` | `POST /api/bookings` |
| UnlockVehicle | scaffold | `POST /unlock/:bookingId` | `POST /api/rides/unlock` |
| EndRide | scaffold | `POST /ride/:rideId/end` | `POST /api/rides/:rideId/end` |

## TODO — next slice: VehicleDetails

- [ ] `apps/web/src/app/vehicles/[id]/page.tsx` — route for vehicle detail
- [ ] Implement `VehicleDetails` slice end-to-end (handler, page, hook)
- [ ] `DrizzleVehicleRepository.findById` is already implemented and ready
