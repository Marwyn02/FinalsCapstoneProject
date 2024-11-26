"use client";

import React, { useMemo } from "react";
import { Review } from "@/app/lib/types/types";
import { calculateAverageReviewRating } from "@/app/utils/ReviewHelpers";

const ReviewStatistics = ({ reviews }: { reviews: Review[] }) => {
  const singleReviewTotal = useMemo(
    () => calculateAverageReviewRating(reviews),
    [reviews]
  );

  return (
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
  );
};

export default ReviewStatistics;
