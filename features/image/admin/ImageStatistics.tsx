"use client";

import React from "react";
import { Image } from "@/app/lib/types/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const ImageStatistics = ({
  images,
  pendingImages,
}: {
  images: Image[];
  pendingImages: Image[];
}) => {
  return (
    <section className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-teko font-medium">Images</h1>

        <div className="flex items-center gap-x-3">
          <Link
            href={"/admin-dashboard/image/collection"}
            className="flex items-center bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
          >
            View Image Table <ChevronRight className="h-4 w-4 ml-1" />
          </Link>

          <Link
            href={"/admin-dashboard/image/pending"}
            className="flex items-center bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
          >
            View Pending Images (
            <span className="text-red-600 font-medium">
              {pendingImages.length}
            </span>
            ) <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 divide-x-[1px] divide-gray-400 gap-x-5">
        <div className="col-span-1 space-y-3">
          <h2>Total Images</h2>

          <div className="flex items-center gap-x-4">
            <p className="font-medium text-4xl">{images.length}</p>
          </div>
        </div>

        <div className="col-span-3"></div>
      </div>
    </section>
  );
};

export default ImageStatistics;
