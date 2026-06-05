import { VehicleDetailsPage } from '@/slices/VehicleDetails/VehicleDetails.page';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VehicleDetailsRoute({ params }: Props) {
  const { id } = await params;
  return <VehicleDetailsPage vehicleId={id} />;
}
