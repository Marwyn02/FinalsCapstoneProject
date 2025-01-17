import { ReviewFetchArchive } from "@/app/api/review/ReviewFetch";
import { Admin } from "@/app/lib/types/types";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

export default async function Table({ admin }: { admin: Admin }) {
  const reviews = await ReviewFetchArchive();

  return (
    <div className="bg-white">
      <DataTable columns={columns} data={reviews} adminId={admin.adminId} />
    </div>
  );
}
