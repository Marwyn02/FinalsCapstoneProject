"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Review } from "@/app/lib/types/types";

import { calculateSingleReviewTotal } from "@/app/utils/ReviewHelpers";
import { ChevronLeft } from "lucide-react";

const PendingReviewStatistics = ({
  pendingReviews,
}: {
  pendingReviews: Review[];
}) => {
  const properties: (keyof Review)[] = useMemo(
    () => [
      "staff",
      "valueForMoney",
      "facilities",
      "location",
      "cleanliness",
      "comfort",
    ],
    []
  );

  // To compute the total for a single review, you can call the function for that specific review
  const singleReviewTotal = useMemo(
    () => calculateSingleReviewTotal(pendingReviews[0], properties), // Calculate for the first review
    [pendingReviews, properties]
  );

  return (
    <section className="space-y-3">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-medium font-teko">Pending Reviews</h1>

        <Link
          href={"/admin-dashboard/reviews"}
          className="flex items-center bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to review list
        </Link>
      </div>

      <div className="grid grid-cols-4 divide-x-[1px] divide-gray-400 gap-x-5">
        <div className="col-span-1 space-y-3">
          <h2>Total Pending Reviews</h2>

          <div className="flex items-center gap-x-4">
            <p className="font-medium text-4xl">{pendingReviews.length}</p>
          </div>
        </div>
        <div className="col-span-3"></div>
      </div>
    </section>
  );
};

export default PendingReviewStatistics;
