import ReservationPaymentForm from "@/features/reservation/components/ReservationPaymentForm";
import ReservationSummary from "@/features/reservation/components/ReservationSummary";

export default async function Page() {
  return (
    <main className="space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-5 md:gap-x-5 mx-0 md:mx-28 md:pb-5 pt-5">
        <ReservationPaymentForm />
        <ReservationSummary />
      </section>
    </main>
  );
}
