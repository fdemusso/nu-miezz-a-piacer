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
| VehicleDetails | ✅ Done | `GET /vehicles/[id]` | `GET /api/vehicles/:vehicleId` |
| BookVehicle | ✅ Done | `GET /vehicles/[id]/book` | `POST /api/bookings` |
| UnlockVehicle | ✅ Done | `GET /vehicles/[id]/unlock` | `POST /api/rides/unlock` |
| EndRide | scaffold | — | `POST /api/rides/:rideId/end` |

## Test VehicleDetails

```bash
# Start all apps
pnpm dev

# Test API directly
curl http://localhost:3001/api/vehicles/v1
curl http://localhost:3001/api/vehicles/v8
curl http://localhost:3001/api/vehicles/nonexistent  # → 404

# Frontend flow
# 1. Open http://localhost:3000
# 2. Click "Vedi dettagli" on any available vehicle card
# 3. Lands on http://localhost:3000/vehicles/v1 (or v2, v4, v6, v8)
```

Response shape:
```json
{
  "vehicle": {
    "id": "v1",
    "type": "SCOOTER",
    "status": "AVAILABLE",
    "model": "Niu N1S",
    "licensePlate": "EL-001",
    "battery": { "level": 85, "estimatedRangeKm": 51 },
    "specs": { "maxSpeedKmh": 45, "weightKg": 28, "maxRangeKm": 60 },
    "features": { "hasGps": true, "hasHelmetStorage": false, "hasUsb": false, "hasLock": true },
    "pricing": {
      "unlockFee": { "amount": 1, "currency": "EUR" },
      "perMinuteRate": { "amount": 0.25, "currency": "EUR" }
    },
    "location": { "lat": 45.467, "lng": 9.1865 }
  }
}
```

## Test BookVehicle

```bash
# Start all apps
pnpm dev

# Test API directly (demo user u1, vehicle v1)
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","vehicleId":"v1"}'

# → 201 { booking: { id, userId, vehicleId, status: "CONFIRMED", expiresAt, ... } }

# Error cases:
# vehicle not found       → 404 { error: "Vehicle not found" }  [if vehicleId invalid]
# vehicle not available   → 409 { error: "Vehicle not available" }
# user has active booking → 409 { error: "User already has an active booking" }
# missing fields          → 400 { error: "userId and vehicleId are required" }
```

**Frontend flow:**
1. Open http://localhost:3000
2. Click "Vedi dettagli" on any AVAILABLE vehicle card
3. Click "Prenota" (sticky CTA) → navigates to `/vehicles/[id]/book`
4. Review vehicle summary + pricing
5. Click "Conferma prenotazione"
6. See booking confirmation with ID, expiry time, next-step hint

**What happens on booking:**
- Vehicle status → `RESERVED` in DB
- Booking created with `status: CONFIRMED`, expiry = now + 10 min
- Demo user `u1` (demo@mvp.local) used as requester (no auth in MVP)
- `setActiveBooking` called in Zustand store for future slices

## Test UnlockVehicle

```bash
# Start all apps
pnpm dev

# 1. Book a vehicle (get bookingId from response)
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","vehicleId":"v1"}'
# → { booking: { id: "<bookingId>", status: "CONFIRMED", ... } }

# 2. Unlock vehicle (use bookingId from step 1)
curl -X POST http://localhost:3001/api/rides/unlock \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","bookingId":"<bookingId>","startLat":45.4654,"startLng":9.1859}'
# → 201 { ride: { id, userId, vehicleId, status: "ACTIVE", startedAt, startLocation }, unlockCode: "MOCK-UNLOCK-001" }
```

**Frontend flow:**
1. Open http://localhost:3000
2. Click any AVAILABLE vehicle → `VehicleDetails`
3. Click "Prenota" → `BookVehicle` page
4. Click "Conferma prenotazione" → booking confirmed
5. Click **"Vai allo sblocco →"** → `/vehicles/[id]/unlock?bookingId=...`
6. Review booking summary + mock unlock method (QR / Mock)
7. Click **"Sblocca & Avvia corsa"**
8. See ride confirmation: ID, start time, position, status badge "In corso"

**What happens on unlock:**
- Booking validated: must be `CONFIRMED` and belong to demo user `u1`
- Zone check via `MockZoneValidator` (always passes)
- `Ride` created in DB with `status: ACTIVE`, `startedAt: now`
- `MockUnlockService.unlock()` called → returns `{ success: true, unlockCode: "MOCK-UNLOCK-001" }`
- Booking status → `ACTIVE`
- Vehicle status → `IN_USE`

**MVP assumptions:**
- Demo user hardcoded: `u1`
- Start coordinates: hardcoded Milan Duomo (`45.4654, 9.1859`) — no real GPS
- Unlock method: mock/QR label shown in UI, no real BLE/QR scanning
- `MockUnlockService` always returns success

## TODO — next slice: EndRide

- [ ] `EndRide` slice: user ends active ride
- [ ] `DrizzleRideRepository.end()` already implemented — needs EndRide handler to call it
- [ ] Handler must verify ride is ACTIVE, calculate duration, call billing service, set vehicle AVAILABLE
- [ ] Frontend: end-ride button (can live on `/vehicles/[id]/unlock` success screen or dedicated route)
