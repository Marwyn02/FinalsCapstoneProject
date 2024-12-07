import { DataTable } from "./DataTable";
import { columns } from "./Columns";
import { ProfitFetchAll } from "@/app/api/profit/ProfitFetch";

export default async function Table() {
  const profits = await ProfitFetchAll();

  return (
    <div className="bg-white">
      <DataTable columns={columns} data={profits} />
    </div>
  );
}
