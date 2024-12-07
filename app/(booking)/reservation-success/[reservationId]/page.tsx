import { ReservationFetchOne } from "@/features/reservation/api/ReservationFetch";
import ReservationReceipt from "@/features/reservation/components/ReservationReceipt";

export default async function Page(props: {
  params: Promise<{ reservationId: string }>;
}) {
  const params = await props.params;
  const { reservationId } = params;
  const reservation = await ReservationFetchOne(reservationId);

  return (
    <ReservationReceipt initialReservation={reservation} id={reservationId} />
  );
}
