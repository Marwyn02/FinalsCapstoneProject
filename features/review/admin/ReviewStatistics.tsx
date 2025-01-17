"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Review } from "@/app/lib/types/types";
import { ChevronRight } from "lucide-react";

import { calculateAverageReviewRating } from "@/app/utils/ReviewHelpers";

const ReviewStatistics = ({
  reviews,
  pendingReviews,
}: {
  reviews: Review[];
  pendingReviews: Review[];
}) => {
  const singleReviewTotal = useMemo(
    () => calculateAverageReviewRating(reviews),
    [reviews]
  );

  return (
    <section className="space-y-3">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-medium font-teko">Reviews</h1>
        <div className="flex items-center gap-x-3">
          <Link
            href={"/admin-dashboard/reviews/archive"}
            className="flex items-center bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
          >
            Archived review
          </Link>

          <Link
            href={"/admin-dashboard/reviews/pending"}
            className="flex items-center bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
          >
            Pending review (
            <span className="text-red-600 font-medium">
              {pendingReviews.length}
            </span>
            ) <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 divide-x-[1px] divide-gray-400 gap-x-5">
        <div className="col-span-1 space-y-3">
          <h2>Total Reviews</h2>

          <div className="flex items-center gap-x-4">
            <p className="font-medium text-4xl">{reviews.length}</p>
          </div>
        </div>

        <div className="col-span-1 space-y-3 pl-10">
          <h2>Average Rating</h2>
          <p className="font-bold text-4xl">{singleReviewTotal.toFixed(1)}</p>
          <p className="text-gray-400 text-sm">Transient house rating</p>
        </div>
        <div className="col-span-2"></div>
      </div>
    </section>
  );
};

export default ReviewStatistics;
