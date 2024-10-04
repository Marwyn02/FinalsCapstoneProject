import BookingCalendar from "@/app/ui/reservations/booking-calendar";
import pause from "@/app/lib/pause";

export default async function Page() {
  await pause(1000);
  return (
    <main className="bg-[#fcf4e9]">
      <BookingCalendar />
    </main>
  );
}
