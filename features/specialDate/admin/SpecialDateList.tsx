"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Admin, Reservation, SpecialPrice } from "@/app/lib/types/types";
import { SpecialPriceDelete } from "../api/SpecialPriceDelete";
import { MoreHorizontal, ChevronRight } from "lucide-react";

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

const SpecialDateList = ({
  specialPrices,
  admin,
  reservation,
}: {
  specialPrices: SpecialPrice[];
  admin: Admin;
  reservation: Reservation[];
}) => {
  return (
    <div className="px-10 py-5 col-start-2 col-span-full space-y-5 h-screen overflow-scroll">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-medium font-teko">Special Date List</h1>

        {admin && admin.role === "master" && (
          <Link
            href={"/admin-dashboard/special-price/archive"}
            className="flex items-center gap-x-1 bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
          >
            Archived Special Date List <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <section className="w-full grid grid-cols-1 gap-y-2">
        {specialPrices.map((specialPrice: SpecialPrice) => (
          <SpecialDateCard
            key={specialPrice.id}
            specialPrice={specialPrice}
            admin={admin}
            reservation={reservation}
          />
        ))}
      </section>
    </div>
  );
};

export default SpecialDateList;

export const SpecialDateCard = ({
  specialPrice,
  admin,
  reservation,
}: {
  specialPrice: SpecialPrice;
  admin: Admin;
  reservation: Reservation[];
}) => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isDateOccupied = reservation.some((r: Reservation) => {
    const checkInDate = new Date(r.checkIn);
    const checkOutDate = new Date(r.checkOut);

    // Check if the specialDate is the same as the checkout date
    const specialDate = new Date(specialPrice.date);

    // We consider the date before checkout as the last occupied day
    const adjustedCheckOutDate = new Date(checkOutDate);
    adjustedCheckOutDate.setDate(adjustedCheckOutDate.getDate() - 1); // Make the checkout exclusive

    // Special date should not be between check-in and adjusted checkout
    return specialDate >= checkInDate && specialDate <= adjustedCheckOutDate;
  });

  const handleDeleteDate = async (id: string, adminId: string) => {
    setLoading(true);
    if (id && adminId) {
      await SpecialPriceDelete(id, adminId);
    }
    setLoading(false);
  };
  return (
    <div className="bg-white grid grid-cols-4 items-center gap-x-1 border rounded-md px-4 py-3 w-full">
      <div>
        <p className="text-gray-500 text-[13px]">Date</p>
        <p className="font-medium">
          {" "}
          {specialPrice.date?.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-[13px]">Price</p>
        <p className="font-medium">
          {specialPrice.price.toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}{" "}
          PHP
        </p>
      </div>

      {isDateOccupied ? (
        <div className="text-center">
          <p className="font-medium text-green-600">In use</p>
        </div>
      ) : (
        <div></div>
      )}

      {admin && admin.role === "master" && !isDateOccupied && (
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
                Delete Date
              </DropdownMenuItem>
            </DropdownMenuContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {" "}
                    Delete Date -{" "}
                    {specialPrice.date?.toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    This action cannot be undone. This will permanently delete
                    the date and remove the date from our servers.
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
                      handleDeleteDate(specialPrice.id, admin.adminId)
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
