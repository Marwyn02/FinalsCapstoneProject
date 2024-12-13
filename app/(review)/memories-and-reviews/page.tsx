"use server";

import { getCurrentUser } from "@/lib/session";
import { ImageFetchClient } from "@/features/image/api/ImageFetch";
import { GetAllReplies } from "@/features/reply/api/GetAllReplies";
import { ReviewFetchAll } from "@/app/api/review/ReviewFetch";

import ReviewPage from "@/features/review/components/ReviewPage";
import MemoriesPage from "@/features/memories/components/MemoriesPage";

export default async function MemoriesAndReviews() {
  const reviews = await ReviewFetchAll();
  const replies = await GetAllReplies();
  const images = await ImageFetchClient();
  const admin = await getCurrentUser();

  return (
    <main className="bg-[#fcf4e9]">
      <MemoriesPage images={images} />
      <ReviewPage reviews={reviews} admin={admin} replies={replies} />
    </main>
  );
}
