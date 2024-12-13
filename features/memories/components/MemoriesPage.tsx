"use client";

import { Image as ImageType } from "@/app/lib/types/types";
import Image from "next/image";

const MemoriesPage = ({ images }: { images: ImageType[] }) => {
  return (
    <main className="md:p-10">
      <section className="py-10 md:px-28">
        <div className="pt-12 pb-5 md:py-10 px-5 md:px-0">
          <h2 className="text-4xl font-medium font-teko uppercase text-start">
            Memories
          </h2>
          <p>
            The guest captured a moment of pure joy, their smile as radiant as
            the setting sun.
          </p>
        </div>

        <section
          className={`h-full overflow-scroll w-full grid ${
            images.length >= 3 ? "grid-cols-2 gap-x-2 gap-y-5" : "grid-cols-1"
          }`}
        >
          {images.map((image: ImageType) => (
            <div
              key={image.id}
              className="space-y-2 h-full w-full bg-white rounded-b-lg"
            >
              <Image
                src={image.url}
                alt={`image-${image.id}`}
                height={1000}
                width={1000}
                className={`rounded-t-lg ${
                  images.length >= 3
                    ? "h-auto w-full"
                    : "h-[300px] md:h-[550px] w-full"
                }`}
              />
              <div className="flex justify-between items-center px-3 pb-1">
                <p className="font-medium">{image.author}</p>
                <p>
                  {image.createdAt.toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
};

export default MemoriesPage;
