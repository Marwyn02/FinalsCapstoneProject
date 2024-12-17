"use client";

import { Voucher } from "@/app/lib/types/types";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { CreateReply } from "@/features/reply/api/CreateReply";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { VoucherRestore } from "../../api/VoucherRestore";

const formSchema = z.object({
  message: z.string(),
});

export const columns: ColumnDef<Voucher>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-start w-min"
      >
        Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const code = row.original.code;
      return <div className="font-medium">{code}</div>;
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
    accessorKey: "amountCash",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = row.original.discountAmount;
      return <div className="font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: "amountPercent",
    header: () => <div>Percent</div>,
    cell: ({ row }) => {
      const percent = row.original.discountPercent;
      return <div className="font-medium">{percent}</div>;
    },
  },
  {
    accessorKey: "expiryDate",
    header: () => <div>Expiration Date</div>,
    cell: ({ row }) => {
      const expiry = row.original.expiryDate;
      return (
        <div className="font-medium">
          {expiry?.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => <div>Archived Date</div>,
    cell: ({ row }) => {
      const updated = row.original.updatedAt;
      return (
        <div className="font-medium">
          {updated?.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const deleted = row.original.isDeleted;
      const expired = row.original.isActive;

      if (deleted)
        return (
          <div className="font-medium capitalize text-red-500">
            {deleted && "Deleted"}
          </div>
        );

      return (
        <div className="font-medium capitalize text-yellow-500">
          {!expired && "Expired"}
        </div>
      );
    },
  },
  {
    accessorKey: "admin",
    header: () => <div>Admin</div>,
    cell: ({ row }) => {
      const admin = row.original.removedByAdmin?.username || "";
      return <div className="font-medium capitalize">{admin}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const voucherCode = row.original.code;
      const state = row.original.isDeleted;

      const handleRestoreVoucher = async (
        voucherId: string,
        adminId: string
      ) => {
        await VoucherRestore(voucherId, adminId);
      };

      if (!state) return <div></div>;

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

              <DropdownMenuItem
                onClick={() =>
                  handleRestoreVoucher(
                    voucherCode,
                    (table.options.meta as any)?.adminId
                  )
                }
              >
                Restore Voucher
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
