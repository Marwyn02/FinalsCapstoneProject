"use client";

import React, { useState } from "react";
import { SpecialPrice } from "@/app/lib/types/types";
import { SpecialPriceDelete } from "../api/SpecialPriceDelete";
import { MoreHorizontal } from "lucide-react";

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
}: {
  specialPrices: SpecialPrice[];
}) => {
  return (
    <div className="px-10 py-5 col-span-2 space-y-5 h-screen overflow-scroll">
      <h2 className="text-2xl font-medium font-teko">Special Date List</h2>
      <section className="w-full grid grid-cols-1 gap-y-2">
        {specialPrices.map((specialPrice: SpecialPrice) => (
          <SpecialDateCard key={specialPrice.id} specialPrice={specialPrice} />
        ))}
      </section>
    </div>
  );
};

export default SpecialDateList;

export const SpecialDateCard = ({
  specialPrice,
}: {
  specialPrice: SpecialPrice;
}) => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteDate = async (id: string) => {
    setLoading(true);
    await SpecialPriceDelete(id);
    setLoading(false);
  };
  return (
    <div className="bg-white grid grid-cols-3 items-center gap-x-1 border rounded-md px-4 py-3 w-full">
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
                  This action cannot be undone. This will permanently delete the
                  date and remove the date from our servers.
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
                  onClick={() => handleDeleteDate(specialPrice.id)}
                  disabled={loading}
                >
                  Yes, delete it.
                </Button>
              </section>
            </DialogContent>
          </Dialog>
        </DropdownMenu>
      </div>
    </div>
  );
};
