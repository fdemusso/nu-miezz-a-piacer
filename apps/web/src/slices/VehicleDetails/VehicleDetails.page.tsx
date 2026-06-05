'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface VehicleDetailsPageProps {
  vehicleId: string;
}

export function VehicleDetailsPage({ vehicleId: _vehicleId }: VehicleDetailsPageProps) {
  return (
    <AppLayout title="Vehicle Details" hideNav>
      <div className="p-4 space-y-4">
        {/* TODO: implement with useVehicleDetails hook */}
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <div className="pt-4">
          <Button className="w-full" size="lg" disabled>
            Book this vehicle
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
