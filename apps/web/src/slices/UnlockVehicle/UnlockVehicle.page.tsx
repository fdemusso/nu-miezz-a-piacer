'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface UnlockVehiclePageProps {
  bookingId: string;
}

export function UnlockVehiclePage({ bookingId: _bookingId }: UnlockVehiclePageProps) {
  return (
    <AppLayout title="Unlock Vehicle" hideNav>
      <div className="p-4 space-y-4">
        {/* TODO: implement with useUnlockVehicle hook */}
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="rounded-lg border bg-muted/30 p-4 text-center">
          <p className="text-sm text-muted-foreground">Walk to the vehicle to unlock it</p>
        </div>
        <Button className="w-full" size="lg" disabled>
          Unlock & Start Ride
        </Button>
      </div>
    </AppLayout>
  );
}
