import React from "react";
import { getCurrentUser } from "@/lib/session";
import { AccountFetchAllForAdmin } from "@/features/account/api/AccountFetch";

import Table from "@/features/account/components/Table";
import AccountPage from "@/features/account/admin/AccountPage";

const Page = async () => {
  const admins = await AccountFetchAllForAdmin();
  const currentAdmin = await getCurrentUser();

  return (
    <main className="bg-white px-20 py-10">
      <AccountPage currentAdmin={currentAdmin} admins={admins} />
      <Table admin={currentAdmin} />
    </main>
  );
};

export default Page;
