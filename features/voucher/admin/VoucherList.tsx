"use client";

import React, { useState } from "react";
import { Admin, Voucher } from "@/app/lib/types/types";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { VoucherDelete } from "../api/VoucherDelete";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import Link from "next/link";

const VoucherList = ({
  vouchers,
  admin,
}: {
  vouchers: Voucher[];
  admin: Admin;
}) => {
  return (
    <div className="px-10 py-5 col-start-2 col-span-full space-y-5 h-screen overflow-scroll">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium font-teko">Voucher List</h2>
        {admin && admin.role === "master" && (
          <Link
            href={"/admin-dashboard/voucher/archive"}
            className="flex items-center gap-x-1 bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
          >
            Archive Vouchers <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <section className="w-full grid grid-cols-1 gap-y-2">
        {vouchers.map((voucher: Voucher) => (
          <VoucherCard key={voucher.id} voucher={voucher} admin={admin} />
        ))}
      </section>
    </div>
  );
};

export default VoucherList;

export const VoucherCard = ({
  voucher,
  admin,
}: {
  voucher: Voucher;
  admin: Admin;
}) => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteVoucher = async (voucherCode: string, adminId: string) => {
    setLoading(true);

    if (voucherCode && adminId) {
      await VoucherDelete(voucherCode, adminId);
      setLoading(false);
    }
  };
  return (
    <div className="bg-white grid grid-cols-9 items-center gap-x-1 border rounded-md px-4 py-3 w-full">
      <div className="col-span-2">
        <p className="text-gray-500 text-[13px]">Voucher Code</p>
        <p className="font-medium">{voucher.code}</p>
      </div>

      <div className="col-span-2">
        <p className="text-gray-500 text-[13px]">Voucher Amount (Cash)</p>
        <p className="font-medium">
          {Number(voucher.discountAmount).toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}{" "}
          PHP
        </p>
      </div>

      <div className="col-span-2">
        <p className="text-gray-500 text-[13px]">Voucher Amount (Percent)</p>
        <p className="font-medium">{voucher.discountPercent}%</p>
      </div>

      <div className="col-span-2">
        <p className="text-gray-500 text-[13px]">Expiry Date</p>
        <p className="font-medium">
          {voucher.expiryDate?.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
        </p>
      </div>

      {admin && admin.role === "master" && (
        <div className="relative flex justify-end items-center">
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

              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                Delete Voucher
              </DropdownMenuItem>
            </DropdownMenuContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Voucher - {voucher.code}</DialogTitle>
                  <DialogDescription className="text-center">
                    This action cannot be undone. This will permanently delete
                    the voucher and remove the voucher from our servers.
                  </DialogDescription>
                </DialogHeader>

                <section className="flex gap-x-6 px-10">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="rounded-md bg-gray-300"
                      disabled={loading}
                    >
                      No
                    </Button>
                  </DialogClose>

                  <Button
                    type="button"
                    className="bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() =>
                      handleDeleteVoucher(voucher.code, admin.adminId)
                    }
                    disabled={loading}
                  >
                    Yes, delete it.
                  </Button>
                </section>
              </DialogContent>
            </Dialog>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};
