"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Map from "@/components/map/Map";
import { Button } from "@/components/ui/button";

const HomeMap = () => {
  return (
    <section>
      <div className="grid grid-cols-8">
        <div className="col-start-2 col-span-6">
          <div className="mb-5 -space-y-1">
            <h2 className="text-3xl font-teko font-medium">
              We're Right Here.
            </h2>
            <p>Find the best route to our transient house.</p>
          </div>

          <Map height={1000} />
        </div>
      </div>

      <section>
        <div className="grid place-content-center gap-y-3 h-[250px] w-full bg-[#353132] py-5 md:mt-10 px-5 md:px-0">
          <p className="text-4xl font-medium font-teko text-gray-50">
            Ready to experience the best Crisanto Transient House has to offer?
          </p>
          <Link href={"/reservations"} className="w-min md:mx-auto">
            <Button className="w-min mx-auto px-14 py-6 flex items-center gap-x-2">
              <p>Book now!</p> <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default HomeMap;
