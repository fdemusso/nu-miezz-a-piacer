'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface BookVehiclePageProps {
  vehicleId: string;
}

export function BookVehiclePage({ vehicleId: _vehicleId }: BookVehiclePageProps) {
  return (
    <AppLayout title="Book Vehicle" hideNav>
      <div className="p-4 space-y-4">
        {/* TODO: implement with useBookVehicle hook */}
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-20 w-full" />
        <div className="rounded-lg border p-4 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Button className="w-full" size="lg" disabled>
          Confirm Booking
        </Button>
      </div>
    </AppLayout>
  );
}
