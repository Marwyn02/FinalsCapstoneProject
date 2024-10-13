import { AdminAnalytics, UpcomingSchedule } from "@/app/ui/admin/overview";

export default function Page() {
  return (
    <main className="px-24 py-12 space-y-3">
      <h3 className="text-2xl font-medium">Overview</h3>

      <AdminAnalytics />
      <UpcomingSchedule />
    </main>
  );
}
