import { BookVehiclePage } from '@/slices/BookVehicle/BookVehicle.page';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookVehicleRoute({ params }: Props) {
  const { id } = await params;
  return <BookVehiclePage vehicleId={id} />;
}
