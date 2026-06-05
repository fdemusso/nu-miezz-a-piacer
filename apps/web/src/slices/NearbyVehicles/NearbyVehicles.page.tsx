'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';

// TODO: replace placeholder coords with geolocation
const DEMO_LAT = 45.4654;
const DEMO_LNG = 9.1859;

export function NearbyVehiclesPage() {
  return (
    <AppLayout title="Nearby Vehicles" activeNav="/">
      <div className="p-4 space-y-3">
        {/* TODO: replace with map + vehicle list */}
        <div className="h-48 w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
          Map placeholder ({DEMO_LAT}, {DEMO_LNG})
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </AppLayout>
  );
}
