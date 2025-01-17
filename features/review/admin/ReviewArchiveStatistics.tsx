"use client";

import React from "react";
import { Review } from "@/app/lib/types/types";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const ReviewStatistics = ({ reviews }: { reviews: Review[] }) => {
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
          <h2>Total Reviews</h2>

          <div className="flex items-center gap-x-4">
            <p className="font-medium text-4xl">{reviews.length}</p>
          </div>
        </div>

        <div className="col-span-3"></div>
      </div>
    </section>
  );
};

export default ReviewStatistics;
