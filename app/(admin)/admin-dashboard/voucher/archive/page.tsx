"use server";

import { getCurrentUser } from "@/lib/session";
import { VoucherFetchArchivedInAdmin } from "@/features/voucher/api/VoucherFetch";

import Table from "@/features/voucher/components/Table/Table";
import VoucherArchiveStatistics from "@/features/voucher/admin/VoucherArchiveStatistics";

const Page = async () => {
  const admin = await getCurrentUser();
  const voucher = await VoucherFetchArchivedInAdmin();

  return (
    <main className="bg-white px-20 py-10">
      <VoucherArchiveStatistics voucher={voucher} /> <Table admin={admin} />
    </main>
  );
};

export default Page;
