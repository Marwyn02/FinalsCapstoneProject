"use client";

import Image from "next/image";
import { Image as ImageType } from "@/app/lib/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ImageDelete, ImageRestore } from "../api/ImageDeleteRestore";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<ImageType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-start w-min"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const { fileName, url } = row.original;

      return (
        <div className="font-medium flex items-center gap-x-2">
          <Image
            src={url}
            alt="Image"
            height={100}
            width={100}
            className="h-[25px] w-[40px]"
          />
          {fileName}
        </div>
      );
    },
    // sortingFn: (rowA, rowB) => {
    //   const dateA = parseInt(
    //     `${rowA.original.year}${rowA.original.month.padStart(2, "0")}`,
    //     10
    //   );
    //   const dateB = parseInt(
    //     `${rowB.original.year}${rowB.original.month.padStart(2, "0")}`,
    //     10
    //   );
    //   return dateA - dateB;
    // },
  },
  {
    accessorKey: "id",
    header: () => <div>Public Id</div>,
    cell: ({ row }) => {
      const publicId = row.original.publicId;
      return <div className="font-medium">{publicId}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div
          className={`font-medium capitalize ${
            status === "confirmed"
              ? "text-green-600"
              : status === "cancelled"
              ? "text-red-700"
              : "text-red-700"
          }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Created At</div>,
    cell: ({ row }) => {
      const create = row.original.createdAt;

      return (
        <div className="font-medium">
          {create.toLocaleString("en-US", {
            month: "2-digit",
            year: "numeric",
            day: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "acceptedBy",
    header: () => <div>Accepted By</div>,
    cell: ({ row }) => {
      const accept = row.original.addedByAdmin?.username;
      return <div className="font-medium capitalize">{accept}</div>;
    },
  },
  {
    accessorKey: "deletedBy",
    header: () => <div>Deleted By</div>,
    cell: ({ row }) => {
      const deletedBy = row.original.removedByAdmin?.username;
      return <div className="font-medium capitalize">{deletedBy}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const { url, isDeleted } = row.original;

      const handleRemoveImage = async (url: string, adminId: string) => {
        await ImageDelete(url, adminId);
      };

      const handleRestoreImage = async (url: string, adminId: string) => {
        await ImageRestore(url, adminId);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {!isDeleted && (
                <DropdownMenuItem
                  onClick={() =>
                    handleRemoveImage(url, (table.options.meta as any)?.adminId)
                  }
                >
                  Delete Image
                </DropdownMenuItem>
              )}

              {isDeleted && (
                <DropdownMenuItem
                  onClick={() =>
                    handleRestoreImage(
                      url,
                      (table.options.meta as any)?.adminId
                    )
                  }
                >
                  Restore Image
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
