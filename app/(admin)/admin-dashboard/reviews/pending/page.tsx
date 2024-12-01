"use server";

import { getCurrentUser } from "@/lib/session";
import { ReviewFetchPending } from "@/app/api/review/ReviewFetch";

import PendingReviewList from "@/app/ui/admin/review/PendingReviewList";
import Table from "@/features/review/components/pendingReviewTable/Table";

const Page = async () => {
  const admin = await getCurrentUser();
  const pendingReviews = await ReviewFetchPending();

  return (
    <main className="bg-white px-20 py-10">
      <PendingReviewList pendingReviews={pendingReviews} />
      <Table admin={admin} />
    </main>
  );
};

export default Page;
