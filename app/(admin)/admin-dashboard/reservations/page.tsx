import { getCurrentUser } from "@/lib/session";
import { ReservationFetchAll } from "@/features/reservation/api/ReservationFetch";

import ReservationList from "@/features/reservation/admin/ReservationList";

const Page = async () => {
  const reservations = await ReservationFetchAll();
  const admin = await getCurrentUser();

  return (
    <main className="min-h-screen bg-[#fcf4e9]">
      <ReservationList reservations={reservations} admin={admin} />
    </main>
  );
};

export default Page;
