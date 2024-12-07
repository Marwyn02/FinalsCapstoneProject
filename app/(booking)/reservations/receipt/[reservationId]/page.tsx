import { ReservationFetchOne } from "@/features/reservation/api/ReservationFetch";
import { Reservation } from "@/app/lib/types/types";
import ReservationDetail from "@/features/reservation/admin/ReservationDetail";

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ reservationId: string }>;
}) {
  const reservationId = (await params).reservationId;
  const reservation: Reservation | null = await ReservationFetchOne(
    reservationId
  );
  return (
    <main className="pt-28 pb-10 md:py-10 mx-0 md:mx-32">
      <ReservationDetail reservation={reservation} />
    </main>
  );
}
