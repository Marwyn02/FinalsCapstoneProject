import { getCurrentUser } from "@/lib/session";
import { getAllConfirmedReservation } from "@/features/reservation/api/route";
import { SpecialPriceFetch } from "@/features/specialDate/api/SpecialPriceFetch";

import SpecialPriceForm from "@/features/specialDate/admin/SpecialPriceForm";
import SpecialDateList from "@/features/specialDate/admin/SpecialDateList";

const Page = async () => {
  const reservations = await getAllConfirmedReservation();
  const specialPrices = await SpecialPriceFetch();
  const admin = await getCurrentUser();

  return (
    <main className="grid grid-cols-1 lg:grid-cols-3 h-screen">
      {admin && admin.role === "master" ? (
        <SpecialPriceForm
          specialPrice={specialPrices}
          reservations={reservations}
          admin={admin}
        />
      ) : (
        <div className="bg-gray-50 h-full w-full"></div>
      )}
      <SpecialDateList
        specialPrices={specialPrices}
        admin={admin}
        reservation={reservations}
      />
    </main>
  );
};

export default Page;
