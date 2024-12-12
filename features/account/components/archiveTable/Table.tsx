import { Admin } from "@/app/lib/types/types";

import { columns } from "./Columns";
import { DataTable } from "./DataTable";

export default async function Table({
  admin,
  accounts,
}: {
  admin: Admin;
  accounts: Admin[];
}) {
  return (
    <div className="bg-white">
      <DataTable columns={columns} data={accounts} admin={admin} />
    </div>
  );
}
