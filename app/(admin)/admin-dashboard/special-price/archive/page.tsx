"use server";

import { getCurrentUser } from "@/lib/session";
import { SpecialPriceFetchArchivedInAdmin } from "@/features/specialDate/api/SpecialPriceFetch";

import Table from "@/features/specialDate/components/Table/Table";
import SpecialPriceArchiveStatistics from "@/features/specialDate/admin/SpecialPriceArchiveStatistics";

const Page = async () => {
  const admin = await getCurrentUser();
  const specialPrice = await SpecialPriceFetchArchivedInAdmin();

  return (
    <main className="bg-white px-20 py-10">
      <SpecialPriceArchiveStatistics specialPrice={specialPrice} />{" "}
      <Table admin={admin} />
    </main>
  );
};

export default Page;
