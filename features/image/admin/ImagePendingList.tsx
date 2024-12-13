"use client";

import React from "react";
import Image from "next/image";
import { Admin, Image as ImageType } from "@/app/lib/types/types";
import { Check, X } from "lucide-react";
import { ImageAccept, ImageReject } from "../api/ImageAcceptReject";

const ImagePendingList = ({
  images,
  admin,
}: {
  images: ImageType[];
  admin: Admin;
}) => {
  const handleImage = async (id: number, adminId: string, status: string) => {
    if (status === "accept") {
      await ImageAccept(id, adminId);
    } else {
      await ImageReject(id, adminId);
    }
  };
  return (
    <div className="grid grid-cols-3 gap-5 py-10">
      {images.length > 0 ? (
        images.map((image: ImageType) => (
          <div key={image.id}>
            {image.url ? (
              <div className="space-y-2 rounded-md">
                <Image
                  src={image.url}
                  alt={"alt"}
                  height={400}
                  width={400}
                  className="rounded-md h-[250px] w-full"
                />

                <div className="flex justify-between items-start">
                  <p className="font-medium capitalize">{image.author}</p>
                  <p className="text-sm">
                    {image.createdAt.toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex justify-between items-start">
                  <button
                    className="flex items-center gap-x-1.5 hover:bg-blue-50 rounded-md duration-300 px-3 py-1"
                    onClick={() =>
                      handleImage(image.id, admin.adminId, "accept")
                    }
                  >
                    <Check className="h-4 w-4 text-green-600" />{" "}
                    <p className="text-green-600">Accept</p>
                  </button>

                  <button
                    className="flex items-center gap-x-1.5 hover:bg-blue-50 rounded-md duration-300 px-3 py-1"
                    onClick={() =>
                      handleImage(image.id, admin.adminId, "reject")
                    }
                  >
                    <X className="h-4 w-4 text-red-500" />{" "}
                    <p className="text-red-500">Reject</p>
                  </button>
                </div>
              </div>
            ) : (
              <p>No image</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center font-medium col-start-2 py-5">No images</p>
      )}
    </div>
  );
};

export default ImagePendingList;
