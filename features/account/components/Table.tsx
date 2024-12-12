import { Admin } from "@/app/lib/types/types";
import { AccountFetchAllForAdmin } from "../api/AccountFetch";

import { columns } from "./Columns";
import { DataTable } from "./DataTable";

export default async function Table({ admin }: { admin: Admin }) {
  const accounts = await AccountFetchAllForAdmin();

  return (
    <div className="bg-white">
      <DataTable columns={columns} data={accounts} admin={admin} />
    </div>
  );
}
