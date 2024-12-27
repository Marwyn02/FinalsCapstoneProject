"use server";

import { ImagePendingfetch } from "@/features/image/api/ImageFetch";
import { getCurrentUser } from "@/lib/session";

import ImagePendingList from "@/features/image/admin/ImagePendingList";
import ImagePendingStatistics from "@/features/image/admin/ImagePendingStatistics";

const Page = async () => {
  const admin = await getCurrentUser();
  const images = await ImagePendingfetch();

  return (
    <main className="bg-white px-20 py-10">
      <ImagePendingStatistics images={images} />
      <ImagePendingList images={images} admin={admin} />
    </main>
  );
};

export default Page;
