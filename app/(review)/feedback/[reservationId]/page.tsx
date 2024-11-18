"use server";

import { redirect } from "next/navigation";
import { getReservation } from "@/features/reservation/api/route";
import {
  CheckReservationReview,
  CheckReservationReviewExist,
} from "@/features/review/api/CheckReservationReview";

import ReviewForm from "@/app/ui/admin/review/ReviewForm";
import ReviewTerms from "@/features/review/components/ReviewTerms";
import ReviewThankyou from "@/features/review/components/ReviewThankyou";

const Page = async (props: { params: Promise<{ reservationId: string }> }) => {
  const params = await props.params;
  const { reservationId } = params;
  const reservation = await getReservation(reservationId);
  const existingReview = await CheckReservationReview(reservationId);
  const existingReservation = await CheckReservationReviewExist(reservationId);

  // if theres no reservation exist using reservation id
  // then go to home page
  if (!existingReservation?.success) {
    redirect("/");
  }
  return (
    <main className="bg-[#fcf4e9] grid md:grid-cols-2 md:gap-x-4 md:px-24 pt-20 pb-5">
      {existingReview && !existingReview.success ? (
        <ReviewThankyou />
      ) : (
        <>
          <ReviewForm reservation={reservation} />
          <ReviewTerms />
        </>
      )}
    </main>
  );
};

export default Page;
