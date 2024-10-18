"use server";

import { getAllReservation } from "@/app/api/reservation/route";
import { AdminAnalytics, UpcomingSchedule } from "@/app/ui/admin/overview";

export default async function Page() {
  const reservations = await getAllReservation();

  return (
    <main className="px-24 py-12 space-y-3">
      <h3 className="text-2xl font-medium">Overview</h3>

      <AdminAnalytics reservations={reservations} />
      <UpcomingSchedule reservations={reservations} />
    </main>
  );
}
