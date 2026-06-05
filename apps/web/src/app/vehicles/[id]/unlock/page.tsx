import { UnlockVehiclePage } from '@/slices/UnlockVehicle/UnlockVehicle.page';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bookingId?: string }>;
}

export default async function UnlockVehicleRoute({ params, searchParams }: Props) {
  const { id } = await params;
  const { bookingId = '' } = await searchParams;
  return <UnlockVehiclePage vehicleId={id} bookingId={bookingId} />;
}
