"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Review, Voucher, SpecialPrice } from "@/app/lib/types/types";
import { ChevronLeft } from "lucide-react";
import { calculateAverageReviewRating } from "@/app/utils/ReviewHelpers";

const SpecialPriceArchiveStatistics = ({
  specialPrice,
}: {
  specialPrice: SpecialPrice[];
}) => {
  return (
    <section className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-medium font-teko">Archived Dates</h1>

        <Link
          href={"/admin-dashboard/special-price"}
          className="flex items-center gap-x-1 bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
        >
          <ChevronLeft className="h-4 w-4" /> Special Date List
        </Link>
      </div>
      <div className="grid grid-cols-4 divide-x-[1px] divide-gray-400 gap-x-5">
        <div className="col-span-1 space-y-3">
          <h2>Total Archived Dates</h2>

          <div className="flex items-center gap-x-4">
            <p className="font-medium text-4xl">{specialPrice.length}</p>
          </div>
        </div>

        <div className="col-span-3"></div>
      </div>
    </section>
  );
};

export default SpecialPriceArchiveStatistics;
