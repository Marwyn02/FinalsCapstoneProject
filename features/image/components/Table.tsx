import { columns } from "./Columns";
import { DataTable } from "./DataTable";
import { Admin } from "@/app/lib/types/types";
import { ImageFetch } from "../api/ImageFetch";

export default async function Table({ admin }: { admin: Admin }) {
  const images = await ImageFetch();

  return (
    <div className="bg-white">
      <DataTable columns={columns} data={images} admin={admin} />
    </div>
  );
}
