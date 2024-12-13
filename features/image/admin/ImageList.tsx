"use client";

import React from "react";
import Image from "next/image";
import { Image as ImageType } from "@/app/lib/types/types";

const ImageList = ({ images }: { images: ImageType[] }) => {
  return (
    <div className="grid grid-cols-3 gap-5 py-10">
      {images.length > 0 ? (
        images.map((image: ImageType) => (
          <div key={image.id}>
            {image.url ? (
              <Image
                src={image.url}
                alt={"alt"}
                height={400}
                width={400}
                className="rounded-md h-[250px] w-full"
              />
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

export default ImageList;
