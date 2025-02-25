/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Map from "@/components/map/Map";
import { Button } from "@/components/ui/button";

const HomeMap = () => {
  return (
    <section>
      <div className="">
        <div className="col-start-2 col-span-6">
          <div className="px-5 pt-10 md:px-40 mb-5 -space-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-teko font-medium">
                  We're Right Here.
                </h2>
                <p>Find the best route to our transient house.</p>
              </div>
              <div className="text-end md:text-start">
                <a
                  href="https://www.google.com/maps/dir//Purok+2+Santiago+Sur,+City+of+San+Fernando+La+Union,+Purok+2,+San+Fernando,+La+Union/@16.6081015,120.3312582,15.2z/data=!4m9!4m8!1m0!1m5!1m1!1s0x33918f47ac568cc1:0x1ef6a685c36c829!2m2!1d120.3349024!2d16.6098255!3e0?entry=ttu&g_ep=EgoyMDI0MTAyNy4wIKXMDSoASAFQAw%3D%3D"
                  className="font-semibold underline text-start text-sm hover:text-gray-600 duration-300"
                >
                  Here's where we're at.
                </a>
              </div>
            </div>
          </div>

          <Map height={2000} />
        </div>
      </div>

      <section>
        <div className="grid place-content-center gap-y-5 h-[300px] w-full bg-[#353132] py-5 md:mt-10 px-5 md:px-0">
          <p className="text-4xl font-medium font-teko text-gray-50">
            Ready to experience the best Crisanto Transient House has to offer?
          </p>
          <Link href={"/reservations"} className="w-min md:mx-auto">
            <Button className="w-min md:w-[500px] mx-auto px-16 py-8 flex items-center gap-x-2 text-base bg-[#dbb07c] text-black hover:bg-white hover:text-black font-semibold">
              <p>Book now!</p> <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default HomeMap;
