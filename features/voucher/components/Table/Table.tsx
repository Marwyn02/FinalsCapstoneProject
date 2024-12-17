import { columns } from "./Columns";
import { Admin } from "@/app/lib/types/types";
import { DataTable } from "@/features/voucher/components/Table/DataTable";
import { VoucherFetchArchivedInAdmin } from "../../api/VoucherFetch";

export default async function Table({ admin }: { admin: Admin }) {
  const voucher = await VoucherFetchArchivedInAdmin();

  return (
    <div className="bg-white">
      <DataTable columns={columns} data={voucher} admin={admin} />
    </div>
  );
}
