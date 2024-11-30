import React from "react";
import { getCurrentUser } from "@/lib/session";
import { AccountFetchArchive } from "@/features/account/api/AccountFetch";

import AccountArchiveStatistics from "@/features/account/admin/AccountArchiveStatistics";
import Table from "@/features/account/components/archiveTable/Table";

const Page = async () => {
  const admins = await AccountFetchArchive();
  const currentAdmin = await getCurrentUser();
  const accounts = await AccountFetchArchive();

  return (
    <main className="bg-white px-20 py-10">
      <AccountArchiveStatistics admins={admins} />
      <Table admin={currentAdmin} accounts={accounts} />
    </main>
  );
};

export default Page;
