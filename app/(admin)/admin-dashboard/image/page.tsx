"use server";

import { ImageFetch, ImagePendingfetch } from "@/features/image/api/ImageFetch";

import ImageList from "@/features/image/admin/ImageList";
import ImageStatistics from "@/features/image/admin/ImageStatistics";

const Page = async () => {
  const images = await ImageFetch();
  const pendingImages = await ImagePendingfetch();

  return (
    <main className="bg-white px-20 py-10">
      <ImageStatistics images={images} pendingImages={pendingImages} />
      <ImageList images={images} />
    </main>
  );
};

export default Page;
