"use client";

import { Review } from "@/app/lib/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReviewAccept, ReviewCancel } from "../../api/ReviewAcceptCancel";

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
        <div
          className={`font-medium capitalize ${
            status === "confirmed" ? "text-green-600" : "text-red-700"
          }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const { reviewId } = row.original;

      const handleReviews = async (
        reviewId: string,
        adminId: string,
        status: string
      ) => {
        if (reviewId && adminId) {
          if (status === "confirmed") {
            await ReviewAccept(reviewId, adminId);
          } else {
            await ReviewCancel(reviewId, adminId);
          }
        }
      };
      return (
        <div className="flex justify-end items-center gap-x-3">
          <button
            className="flex items-center gap-x-1.5 hover:bg-blue-50 rounded-md duration-300 px-3 py-1"
            onClick={() =>
              handleReviews(
                reviewId,
                (table.options.meta as any)?.adminId,
                "confirmed"
              )
            }
          >
            <Check className="h-4 w-4 text-green-600" />{" "}
            <p className="text-green-600">Accept</p>
          </button>

          <button
            className="flex items-center gap-x-1.5 hover:bg-blue-50 rounded-md duration-300 px-3 py-1"
            onClick={() =>
              handleReviews(
                reviewId,
                (table.options.meta as any)?.adminId,
                "cancel"
              )
            }
          >
            <X className="h-4 w-4 text-red-500" />{" "}
            <p className="text-red-500">Reject</p>
          </button>
        </div>
      );
    },
  },
];
