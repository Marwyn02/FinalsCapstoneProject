import ReservationCalendar from "@/features/reservation/components/ReservationCalendar";
import { ReservationFetchAll } from "@/features/reservation/api/ReservationFetch";
import { SpecialPriceFetch } from "@/features/specialDate/api/SpecialPriceFetch";
import { VoucherFetchAll } from "@/features/voucher/api/VoucherFetch";

export default async function Page() {
  const reservations = await ReservationFetchAll();
  const specialPrices = await SpecialPriceFetch();
  const vouchers = await VoucherFetchAll();

  return (
    <main className="bg-[#fcf4e9]">
      <ReservationCalendar
        reservations={reservations}
        specialPrices={specialPrices}
        vouchers={vouchers}
      />
    </main>
  );
}
