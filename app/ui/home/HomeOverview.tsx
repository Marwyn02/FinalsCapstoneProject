"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import HomeOffers from "./HomeOffers";

import { images } from "@/app/lib/placeholder-data";

const HomeOverview = () => {
  return (
    <section className="bg-gray-100 py-8 px-0 md:px-36 space-y-16">
      <section>
        <h2 className="text-4xl font-medium font-teko mb-2 px-5 md:px-0">
          Overview
        </h2>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full px-0 md:px-6"
        >
          <CarouselContent>
            {images.map((i) => (
              <CarouselItem key={i.url} className="lg:basis-1/3">
                <Image
                  src={i.url}
                  alt={i.url}
                  height={1000}
                  width={1000}
                  className="h-[400px] md:h-[320px] object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Home Offers  */}
      <HomeOffers />
    </section>
  );
};

export default HomeOverview;
