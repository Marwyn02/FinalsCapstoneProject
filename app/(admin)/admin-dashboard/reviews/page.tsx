"use server";

import { getCurrentUser } from "@/lib/session";
import {
  ReviewFetchAll,
  ReviewFetchPending,
} from "@/app/api/review/ReviewFetch";

import ReviewList from "@/app/ui/admin/review/ReviewList";
import Table from "@/features/review/components/reviewTable/Table";

const Page = async () => {
  const admin = await getCurrentUser();
  const reviews = await ReviewFetchAll();
  const pendingReviews = await ReviewFetchPending();

  return (
    <main className="bg-white px-20 py-10">
      <ReviewList reviews={reviews} pendingReviews={pendingReviews} />
      <Table admin={admin} />
    </main>
  );
};

export default Page;
