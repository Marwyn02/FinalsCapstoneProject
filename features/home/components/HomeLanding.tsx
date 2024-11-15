"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ParallaxBanner, ParallaxProvider } from "react-scroll-parallax";

import { ChevronRight, MapPin } from "lucide-react";

const HomeLanding = () => {
  return (
    <>
      <ParallaxProvider>
        <ParallaxBanner
          layers={[{ image: "/image/hero.jpg", speed: -15 }]}
          className="w-full h-[550px] md:h-[640px] object-cover brightness-75 contrast-125"
        >
          <div className="absolute w-full h-full px-5 md:px-32 inset-0 flex items-center justify-center md:justify-start text-white">
            <div className="space-y-0 text-center md:text-start">
              <div className="-space-y-1 text-center md:text-start">
                <h2 className="text-slate-100 font-light text-lg lg:text-2xl md:tracking-widest uppercase">
                  Welcome to
                </h2>
                <h1 className="text-8xl lg:text-9xl uppercase font-medium font-teko tracking-wider">
                  Crisanto
                </h1>
                <p className="text-lg lg:text-4xl tracking-[0.5em] uppercase -translate-y-3 font-teko ">
                  Transient House
                </p>
              </div>

              <Link
                href={"/reservations"}
                className="font-semibold tracking-wider text-[#eff1d2] text-sm"
              >
                Book now!
              </Link>
            </div>
          </div>
        </ParallaxBanner>
      </ParallaxProvider>

      <section className="grid grid-cols-1 md:grid-cols-2 md:gap-x-5 md:mx-28 py-16 md:py-8 text-center md:text-start items-center space-y-14 md:space-y-2">
        <div className="col-start-1 col-span-1 md:border-l-2 md:border-gray-700 md:pl-3 px-5">
          <div className="grid space-y-1 mb-3">
            <h3 className="text-4xl font-medium font-teko">About the house</h3>

            <div className="flex justify-start gap-x-1 text-sm text-slate-600 underline">
              <MapPin className="h-4 w-4 text-yellow-500" />
              <p>Santiago Sur, San Fernando, La Union, Philippines</p>
            </div>
          </div>

          <div className="grid space-y-5">
            <div className="grid gap-y-6 md:pr-6 text-base md:text-lg">
              <p>
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
              <p>
                Experience a relaxing getaway with our transient house, designed
                specifically for your comfort and relaxation. Escape the routine
                of everyday life and discover your own private paradise.
              </p>
            </div>

            <Link
              href={"/"}
              className="flex items-center justify-center md:justify-start gap-x-2 text-[#e1bb74] underline"
            >
              Learn more <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="space-y-2 hidden md:block">
          <Image
            src={"/image/hero-2.jpg"}
            alt="Image"
            height={1000}
            width={1000}
            className="h-[390px] w-full object-cover rounded-none md:rounded-lg"
          />
          <p className="font-bold text-sm text-blue-400 tracking-wider px-3">
            Just 15 minutes away from surfing area of the North! San Juan, La
            Union (Elyu)
          </p>
        </section>
      </section>
    </>
  );
};

export default HomeLanding;
