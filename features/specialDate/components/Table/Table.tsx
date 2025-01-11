import { columns } from "./Columns";
import { ReviewFetchInAdmin } from "@/app/api/review/ReviewFetch";
import { Admin } from "@/app/lib/types/types";
import { DataTable } from "@/features/review/components/reviewTable/DataTable";
import { SpecialPriceFetchArchivedInAdmin } from "../../api/SpecialPriceFetch";

export default async function Table({ admin }: { admin: Admin }) {
  const special = await SpecialPriceFetchArchivedInAdmin();

  return (
    <div className="bg-white">
      <DataTable columns={columns} data={special} admin={admin} />
    </div>
  );
}
