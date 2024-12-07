"use client";

import { Profit } from "@/app/lib/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Profit>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-start w-min"
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const month = row.original.month;
      const year = row.original.year;
      const formattedDate = new Date(`${year}-${month}-01`).toLocaleString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      );
      return <div className="font-medium">{formattedDate}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const dateA = parseInt(
        `${rowA.original.year}${rowA.original.month.padStart(2, "0")}`,
        10
      );
      const dateB = parseInt(
        `${rowB.original.year}${rowB.original.month.padStart(2, "0")}`,
        10
      );
      return dateA - dateB;
    },
  },
  {
    accessorKey: "profit",
    header: () => <div>Total Revenue</div>,
    cell: ({ row }) => {
      const profit = parseFloat(row.getValue("profit"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(profit);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "bookings",
    header: () => <div>No. of Bookings</div>,
    cell: ({ row }) => {
      const bookings = Number(row.getValue("bookings"));
      return <div className="font-medium">{bookings}</div>;
    },
  },
  {
    accessorKey: "profit",
    header: () => <div className="text-end">Net Revenue</div>,
    cell: ({ row }) => {
      const profit = parseFloat(row.getValue("profit"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(profit);
      return <div className="font-medium text-end">{formatted}</div>;
    },
  },
];
