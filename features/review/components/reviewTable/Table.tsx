import { columns } from "./Columns";
import { ReviewFetchInAdmin } from "@/app/api/review/ReviewFetch";
import { DataTable } from "./DataTable";
import { Admin } from "@/app/lib/types/types";

export default async function Table({ admin }: { admin: Admin }) {
  const reviews = await ReviewFetchInAdmin();

  return (
    <div className="bg-white">
      <DataTable columns={columns} data={reviews} admin={admin} />
    </div>
  );
}
