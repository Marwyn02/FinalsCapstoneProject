import { BookingSummary } from "@/app/ui/reservations/booking-summary";
import { PaymentForm } from "@/app/ui/reservations/payment-form";
import pause from "@/app/lib/pause";

export default async function Page() {
  await pause(1000);
  return (
    <main className="space-y-10">
      <section className="grid grid-cols-5 gap-x-5 mx-28 pb-5 pt-5">
        <div className="col-span-3">
          <PaymentForm />
        </div>
        <BookingSummary />
      </section>
    </main>
  );
}
