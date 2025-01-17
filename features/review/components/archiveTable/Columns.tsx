"use client";

import { Review } from "@/app/lib/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReviewRestore } from "../../api/ReviewRestore";

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "firstName",
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
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;

      return (
        <div className="font-medium capitalize">
          {firstName + " " + lastName}
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
    accessorKey: "message",
    header: () => <div>Message</div>,
    cell: ({ row }) => {
      const message = row.original.message;
      return <div className="font-medium">{message}</div>;
    },
  },
  {
    accessorKey: "rating",
    header: () => <div>Rating</div>,
    cell: ({ row }) => {
      const rating = Number(row.getValue("rating"));
      return <div className="font-medium">{rating}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="font-medium capitalize text-red-600">{status}</div>
      );
    },
  },
  {
    accessorKey: "RemovedBy",
    header: () => <div>Review removed by</div>,
    cell: ({ row }) => {
      const adminName = row.original.removedByAdmin?.username || "N/A";
      return <div className="font-medium capitalize">{adminName}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const { reviewId } = row.original;

      const handleRestoreReview = async (reviewId: string) => {
        await ReviewRestore(reviewId);
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

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleRestoreReview(reviewId)}>
                Restore Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
