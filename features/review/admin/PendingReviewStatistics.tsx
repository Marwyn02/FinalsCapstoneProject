"use client";

import React from "react";
import { Review } from "@/app/lib/types/types";

const PendingReviewStatistics = ({
  pendingReviews,
}: {
  pendingReviews: Review[];
}) => {
  return (
    <div className="grid grid-cols-4 divide-x-[1px] divide-gray-400 gap-x-5">
      <div className="col-span-1 space-y-3">
        <h2>Total Pending Reviews</h2>

        <div className="flex items-center gap-x-4">
          <p className="font-medium text-4xl">{pendingReviews.length}</p>
        </div>
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};

export default PendingReviewStatistics;
