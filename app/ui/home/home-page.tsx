/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound, MapPin, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Offers from "./offers";
import { ParallaxBanner } from "react-scroll-parallax";

const images = [
  {
    url: "/image/image-2.jpg",
  },
  {
    url: "/image/overview-2.jpg",
  },
  {
    url: "/image/room-1-4.jpg",
  },
  {
    url: "/image/overview-3.jpg",
  },
  {
    url: "/image/room-1-1.jpg",
  },
  {
    url: "/image/hero-2.jpg",
  },
];

export default function HomePage() {
  return (
    <main className="space-b-5 bg-white text-[#1e2447]">
      {/* Hero landing  */}
      <ParallaxBanner
        layers={[{ image: "/image/hero.jpg", speed: -15 }]}
        className="w-full h-[380px] md:h-[640px] object-cover brightness-75 contrast-125"
      >
        <div className="absolute px-5 md:px-32 inset-0 flex items-center justify-start text-white">
          <div className="space-y-0">
            <div className="-space-y-1">
              <h2 className="text-slate-100 font-light text-lg lg:text-2xl md:tracking-widest uppercase">
                Welcome to
              </h2>
              <h1 className="text-5xl md:text-6xl lg:text-9xl uppercase font-medium font-teko tracking-wider">
                Crisanto
              </h1>
              <p className="text-lg lg:text-4xl tracking-[0.5em] uppercase -translate-y-3 font-teko ">
                Transient House
              </p>
            </div>

            <Link
              href={"/reservations"}
              className="font-semibold tracking-[0.2em] text-[#eff1d2]"
            >
              Book Now!
            </Link>
          </div>
        </div>
      </ParallaxBanner>

      {/* About the house and image  */}
      <div className="grid grid-cols-2 gap-x-5 mx-28 py-8 text-start items-center space-y-2">
        <div className="col-start-1 col-span-1 border-l-2 border-gray-700 pl-3">
          <div className="grid space-y-1 mb-3">
            <h3 className="text-4xl font-medium font-teko">About the house</h3>

            <div className="flex justify-start gap-x-1 text-sm text-slate-600 underline">
              <MapPin className="h-4 w-4 text-yellow-500" />
              <p>Santiago Sur, San Fernando, La Union, Philippines</p>
            </div>
          </div>

          <div className="grid space-y-5">
            <div className="grid gap-y-6 pr-6">
              <p className="text-lg">
                Conveniently located{" "}
                <a
                  href={
                    "https://www.google.com/maps/search/Beach/@16.5943299,120.3073701,13.17z/data=!4m7!2m6!3m5!2sPurok+2+Santiago+Sur,+City+of+San+Fernando+La+Union,+Purok+2,+San+Fernando,+La+Union!3s0x33918f47ac568cc1:0x1ef6a685c36c829!4m2!1d120.3349024!2d16.6098255?entry=ttu&g_ep=EgoyMDI0MTAwMS4wIKXMDSoASAFQAw%3D%3D"
                  }
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  near beautiful beaches
                </a>{" "}
                in La Union, Crisanto transient House is the perfect spot for a
                peaceful getaway, offering a range of exciting features,
                including a free Wi-Fi, wide parking, a fully equipped main
                kitchen and a separate dirty kitchen for heavier cooking tasks,
                etc.
              </p>
              <p className="text-lg">
                Experience a relaxing getaway with our transient house, designed
                specifically for your comfort and relaxation. Escape the routine
                of everyday life and discover your own private paradise.
              </p>
            </div>

            <Button className="w-min bg-[#e1bb74] px-6 text-sm rounded-md">
              Learn More
            </Button>
          </div>
        </div>

        <section className="grid space-y-2">
          <Image
            src={"/image/hero-2.jpg"}
            alt="Image"
            height={1000}
            width={1000}
            className="h-[390px] w-full object-cover rounded-lg"
          />
          <p className="font-bold text-sm text-blue-400 tracking-wider">
            Just 15 minutes away from surfing area of the North! San Juan, La
            Union (Elyu)
          </p>
        </section>
      </div>

      {/* Offers  */}
      <section className="bg-gray-100 py-8 px-36 space-y-16">
        <section>
          <h2 className="text-4xl font-medium font-teko mb-2">Overview</h2>

          {/* Images  */}
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full px-6"
          >
            <CarouselContent>
              {images.map((i) => (
                <CarouselItem key={i.url} className="basis-1/3">
                  <Image
                    src={i.url}
                    alt={i.url}
                    height={1000}
                    width={1000}
                    className="h-[320px] object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Offers  */}
        <Offers />
      </section>

      <section className="space-y-10 px-16 mt-10 mb-0 mx-24">
        <div>
          <h2 className="text-4xl font-medium font-teko">Reviews</h2>

          <div className="grid grid-cols-2 px-28 py-5">
            <div className="flex items-center gap-x-5">
              <Star fill="#fcd33d" className="h-16 w-16 text-[#fcd33d]" />
              <p className="text-4xl">5.0</p>
              <div>
                <p className="text-lg">Excellent</p>
                <p className="text-sm text-gray-500">24 reviews</p>
              </div>
            </div>

            {/* Quality stars */}
            <div className="grid grid-cols-2 space-y-1">
              <div className="flex items-center gap-x-2">
                <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                <p>5.0 Staff</p>
              </div>

              <div className="flex items-center gap-x-2">
                <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                <p>5.0 Cleanliness</p>
              </div>

              <div className="flex items-center gap-x-2">
                <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                <p>5.0 Value for money</p>
              </div>

              <div className="flex items-center gap-x-2">
                <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                <p>5.0 Locations</p>
              </div>

              <div className="flex items-center gap-x-2">
                <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                <p>5.0 Facilities</p>
              </div>

              <div className="flex items-center gap-x-2">
                <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                <p>5.0 Comfort</p>
              </div>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-2 border-t border-gray-300 pt-16">
          <div className="h-[200px] w-[450px] space-y-2">
            <div className="space-y-1">
              <CircleUserRound
                strokeWidth={1.5}
                className="h-8 w-8 text-yellow-700"
              />

              <div className="flex justify-between items-center">
                <h4 className="text-yellow-700 font-semibold">Marwyn, 23</h4>
                <div className="flex">
                  <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                  <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                  <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                  <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                  <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                </div>
              </div>
            </div>

            <p className="font-light">
              The transient house felt like home. Comfy beds, warm decor, and a
              welcoming atmosphere. Perfect for a short getaway!
            </p>

            <div className="mt-2">
              <Link
                href={"/memories-and-reviews"}
                className="underline font-medium text-gray-700"
              >
                Show more
              </Link>
            </div>
          </div>

          <div className="h-[200px] w-[450px] space-y-2">
            <div className="space-y-1">
              <CircleUserRound
                strokeWidth={1.5}
                className="h-8 w-8 text-yellow-700"
              />

              <div className="flex justify-between items-center">
                <h4 className="text-yellow-700 font-semibold">Cayhene, 23</h4>
                <div className="flex">
                  <Star fill="#DDD" className="h-5 w-5 text-[#DDD]" />
                  <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                  <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                  <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                  <Star fill="#fcd33d" className="h-5 w-5 text-[#fcd33d]" />
                </div>
              </div>
            </div>

            <p className="font-light">
              We created some unforgettable memories here. The cozy setting made
              our family time extra special.
            </p>

            <div className="mt-2">
              <Link
                href={"/memories-and-reviews"}
                className="underline font-medium text-gray-700"
              >
                Show more
              </Link>
            </div>
          </div>
        </section>
      </section>

      {/* The triangle thing on the home page */}
      <div className="pt-5 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[40px] border-transparent border-b-black mx-auto"></div>
    </main>
  );
}
