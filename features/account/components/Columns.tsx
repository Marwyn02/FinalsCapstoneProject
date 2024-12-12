"use client";

import { Admin } from "@/app/lib/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { AccountSetAdmin, AccountSetMaster } from "../api/AccountSet";
import { AccountDelete } from "../api/AccountDelete";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Admin>[] = [
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
      const username = row.original.username;
      return <div className="font-medium capitalize">{username}</div>;
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
    accessorKey: "email",
    header: () => <div>Email Address</div>,
    cell: ({ row }) => {
      const email = row.original.email;
      return <div className="font-medium">{email}</div>;
    },
  },
  {
    accessorKey: "role",
    header: () => <div>Role</div>,
    cell: ({ row }) => {
      const role = row.original.role;
      return <div className="font-medium capitalize">{role}</div>;
    },
  },
  {
    accessorKey: "loggedIn",
    header: () => <div>Last Login</div>,
    cell: ({ row }) => {
      const state = row.original.loggedIn;
      return (
        <div className="font-medium">
          {state
            ? state.toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
            : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "loggedOut",
    header: () => <div>Logout Time</div>,
    cell: ({ row }) => {
      const state = row.original.loggedOut;
      return (
        <div className="font-medium">
          {state
            ? state.toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
            : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "addedReplies",
    header: () => <div>Added Replies</div>,
    cell: ({ row }) => {
      const addedReplies = row.original.addedReplies?.length;
      return <div className="font-medium">{addedReplies}</div>;
    },
  },
  {
    accessorKey: "addedReviews",
    header: () => <div>Added Reviews</div>,
    cell: ({ row }) => {
      const addedReviews = row.original.addedReviews?.length;
      return <div className="font-medium">{addedReviews}</div>;
    },
  },
  {
    accessorKey: "addedVoucher",
    header: () => <div>Added Vouchers</div>,
    cell: ({ row }) => {
      const addedVouchers = row.original.addedVouchers?.length;
      return <div className="font-medium">{addedVouchers}</div>;
    },
  },
  {
    accessorKey: "addedSpecialPrices",
    header: () => <div>Added Special Prices</div>,
    cell: ({ row }) => {
      const addedSpecialPrices = row.original.addedSpecialPrices?.length;
      return <div className="font-medium">{addedSpecialPrices}</div>;
    },
  },
  {
    accessorKey: "removedReservations",
    header: () => <div>Cancelled Reservations</div>,
    cell: ({ row }) => {
      const removedReservations = row.original.removedReservation?.length;
      return <div className="font-medium">{removedReservations}</div>;
    },
  },
  {
    accessorKey: "removedReviews",
    header: () => <div>Removed Reviews</div>,
    cell: ({ row }) => {
      const removedReviews = row.original.removedReviews?.length;
      return <div className="font-medium">{removedReviews}</div>;
    },
  },
  {
    accessorKey: "removedReplies",
    header: () => <div>Removed Replies</div>,
    cell: ({ row }) => {
      const removedReplies = row.original.removedReplies?.length;
      return <div className="font-medium">{removedReplies}</div>;
    },
  },
  {
    accessorKey: "removedVouchers",
    header: () => <div>Removed Vouchers</div>,
    cell: ({ row }) => {
      const removedVouchers = row.original.removedVouchers?.length;
      return <div className="font-medium">{removedVouchers}</div>;
    },
  },
  {
    accessorKey: "removedSpecialPrices",
    header: () => <div>Removed Special Dates</div>,
    cell: ({ row }) => {
      const removedSpecialPrices = row.original.removedSpecialPrices?.length;
      return <div className="font-medium">{removedSpecialPrices}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { username, role } = row.original;

      const handleAccountSetMaster = async (user: string) => {
        if (user) {
          await AccountSetMaster(user);
        }
      };

      const handleAccountSetAdmin = async (user: string) => {
        if (user) {
          await AccountSetAdmin(user);
        }
      };

      const handleAccountDelete = async (user: string) => {
        if (user) {
          await AccountDelete(user);
        }
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

              {role === "master" && (
                <DropdownMenuItem
                  onClick={() => handleAccountSetAdmin(username)}
                >
                  Retire Admin
                </DropdownMenuItem>
              )}

              {role === "admin" && (
                <DropdownMenuItem onClick={() => handleAccountDelete(username)}>
                  Delete Admin
                </DropdownMenuItem>
              )}

              {role === "admin" && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => handleAccountSetMaster(username)}
                  >
                    Set as Master Admin
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
