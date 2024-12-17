import {
  ReservationFetchAll,
  ReservationFetchOne,
} from "@/features/reservation/api/ReservationFetch";
import { SpecialPriceFetch } from "@/features/specialDate/api/SpecialPriceFetch";
import { VoucherFetchAll } from "@/features/voucher/api/VoucherFetch";

import ReservationUpdateForm from "@/features/reservation/admin/ReservationUpdateForm";

const Page = async (props: { params: Promise<{ reservationId: string }> }) => {
  const params = await props.params;
  const singleReservation = await ReservationFetchOne(params.reservationId);

  const reservations = await ReservationFetchAll();
  const specialPrices = await SpecialPriceFetch();
  const vouchers = await VoucherFetchAll();
  return (
    <ReservationUpdateForm
      singleReservation={singleReservation}
      reservations={reservations}
      specialPrices={specialPrices}
      vouchers={vouchers}
    />
  );
};

export default Page;
