"use client";

import React from "react";
import Link from "next/link";
import { Image } from "@/app/lib/types/types";
import { ChevronLeft } from "lucide-react";

const ImageCollectionStatistics = ({ images }: { images: Image[] }) => {
  return (
    <section className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-teko font-medium">Image Collection</h1>

        <div className="flex items-center gap-x-3">
          <Link
            href={"/admin-dashboard/image"}
            className="flex items-center bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Images
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

export default ImageCollectionStatistics;
