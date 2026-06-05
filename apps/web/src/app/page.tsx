import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info, BookOpen, Unlock, Flag } from 'lucide-react';

const slices = [
  {
    name: 'NearbyVehicles',
    description: "Show available vehicles on a map near the user's location.",
    icon: MapPin,
    route: '/nearby',
    api: 'GET /api/vehicles/nearby',
    status: 'scaffold',
  },
  {
    name: 'VehicleDetails',
    description: 'Display full vehicle info: battery, pricing, specs, features.',
    icon: Info,
    route: '/vehicles/:id',
    api: 'GET /api/vehicles/:vehicleId',
    status: 'scaffold',
  },
  {
    name: 'BookVehicle',
    description: 'Reserve a vehicle. Creates a booking with expiry timer.',
    icon: BookOpen,
    route: '/book/:vehicleId',
    api: 'POST /api/bookings',
    status: 'scaffold',
  },
  {
    name: 'UnlockVehicle',
    description: 'Start a ride by unlocking the vehicle at the pickup location.',
    icon: Unlock,
    route: '/unlock/:bookingId',
    api: 'POST /api/rides/unlock',
    status: 'scaffold',
  },
  {
    name: 'EndRide',
    description: 'End an active ride, validate parking zone, compute cost.',
    icon: Flag,
    route: '/ride/:rideId/end',
    api: 'POST /api/rides/:rideId/end',
    status: 'scaffold',
  },
];

export default function HomePage() {
  return (
    <AppLayout title="Vehicle Sharing" subtitle="MVP Scaffold" activeNav="/">
      <div className="space-y-4 p-4">
        <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
          Scaffold ready. Each card below maps to a VSA slice. Implement one slice per prompt.
        </div>

        {slices.map(({ name, description, icon: Icon, route, api, status }) => (
          <Card key={name} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">{name}</CardTitle>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <CardDescription>{description}</CardDescription>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Route:</span> {route}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  <span className="font-sans font-medium text-foreground">API:</span> {api}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
