"use server";

import { getCurrentUser } from "@/lib/session";
import { ImageFetch } from "@/features/image/api/ImageFetch";

import ImageCollectionStatistics from "@/features/image/admin/ImageCollectionStatistics";
import Table from "@/features/image/components/Table";

const Page = async () => {
  const admin = await getCurrentUser();
  const images = await ImageFetch();

  return (
    <main className="bg-white px-20 py-10">
      <ImageCollectionStatistics images={images} />
      <Table admin={admin} />
    </main>
  );
};

export default Page;
