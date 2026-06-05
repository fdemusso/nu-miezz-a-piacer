'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface EndRidePageProps {
  rideId: string;
}

export function EndRidePage({ rideId: _rideId }: EndRidePageProps) {
  return (
    <AppLayout title="End Ride" hideNav>
      <div className="p-4 space-y-4">
        {/* TODO: implement with useEndRide hook */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-center">
          <p className="text-sm font-medium">Ride in progress</p>
          <Skeleton className="h-8 w-24 mx-auto" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="rounded-lg border p-4 space-y-2">
          <p className="text-xs text-muted-foreground">Make sure you park in a valid zone</p>
        </div>
        <Button variant="destructive" className="w-full" size="lg" disabled>
          End Ride
        </Button>
      </div>
    </AppLayout>
  );
}
