"use server";

import { getCurrentUser } from "@/lib/session";
import { VoucherFetchAll } from "@/features/voucher/api/VoucherFetch";

import VoucherForm from "@/features/voucher/components/VoucherForm";
import VoucherList from "@/features/voucher/admin/VoucherList";

const Page = async () => {
  const vouchers = await VoucherFetchAll();
  const admin = await getCurrentUser();

  return (
    <main className="grid grid-cols-1 lg:grid-cols-3 h-screen">
      {admin && admin.role === "master" ? (
        <VoucherForm admin={admin} />
      ) : (
        <div className="bg-gray-50 h-full w-full"></div>
      )}
      <VoucherList vouchers={vouchers} admin={admin} />
    </main>
  );
};

export default Page;
