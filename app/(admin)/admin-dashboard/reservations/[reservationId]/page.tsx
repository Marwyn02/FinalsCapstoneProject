import { ReservationFetchOne } from "@/features/reservation/api/ReservationFetch";
import { Reservation } from "@/app/lib/types/types";

import ReservationDetail from "@/features/reservation/admin/ReservationDetail";

export default async function ReservationDetailPage(props: {
  params: Promise<{ reservationId: string }>;
}) {
  const params = await props.params;
  const reservation: Reservation | null = await ReservationFetchOne(
    params.reservationId
  );

  return (
    <main className="px-28 py-10 h-screen">
      <ReservationDetail reservation={reservation} />
    </main>
  );
}
