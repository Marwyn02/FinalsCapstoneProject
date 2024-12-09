/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { amenities } from "@/app/lib/placeholder-data";

export default function AmenitiesPage() {
  const Navigation = "section";
  const Feature = "section";

  const [amenityData, setAmenityData] = useState({
    id: 0,
    title: "Ground Floor",
    description:
      "The spacious ground floor combines a cozy living room, a welcoming dining area, and a functional kitchen in a seamless open-plan layout. This harmonious design allows everyone to enjoy quality time together, whether relaxing on comfortable seating, sharing meals at the large dining table, or preparing delicious dishes in the fully-equipped kitchen. Large windows flood the space with natural light, creating a warm and inviting atmosphere perfect for gatherings and making memories.",
    headImage: "/image/room-2-1.jpg",
  });
  const [toggle, setToggle] = useState<String>(amenityData.title);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const amenityDetailToggle = (amenity: String) => {
    if (amenity) {
      setToggle(amenity);
      const selectedAmenity = amenities.find((item) => item.title === amenity);
      if (selectedAmenity) {
        setIsTransitioning(true);
        setTimeout(() => {
          setToggle(amenity);
          setAmenityData(selectedAmenity);
          setIsTransitioning(false);
        }, 515);
      }
    } else {
      setToggle("Ground Floor");
    }
  };

  return (
    <main>
      <section className="md:px-0 lg:mx-28 pt-20 md:pt-24 pb-5 md:pb-16 relative">
        <Navigation className="flex items-center gap-x-2 lg:gap-x-8 font-medium text-sm p-2 border-b border-gray-700 mb-5 md:mb-12 mx-5 md:mx-0">
          <button
            type="button"
            className={`px-4 ${
              toggle === "Ground Floor" && " font-bold text-[#e1bb74]"
            }`}
            onClick={() => amenityDetailToggle("Ground Floor")}
          >
            Ground Floor
          </button>

          <button
            className={`px-4 ${
              toggle === "Bedroom Area" && " font-bold text-[#e1bb74]"
            }`}
            onClick={() => amenityDetailToggle("Bedroom Area")}
          >
            Bedroom Area
          </button>

          {/* <button className="px-4">Comfort Room</button> */}

          <button
            className={`px-4 ${
              toggle === "Outdoor" && " font-bold text-[#e1bb74]"
            }`}
            onClick={() => amenityDetailToggle("Outdoor")}
          >
            Outdoor
          </button>
        </Navigation>

        <Feature>
          <AnimatePresence>
            {!isTransitioning && (
              <motion.div
                key={amenityData.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: 50 },
                }}
                transition={{ duration: 0.5 }}
              >
                <section className="grid grid-cols-1 md:grid-cols-3 gap-x-10">
                  <div className="grid grid-rows-2 order-2 md:order-1 px-5 md:px-0">
                    <div className="row-span-1">
                      <h2 className="text-5xl font-medium font-teko">
                        {amenityData.title}
                      </h2>
                      <p>{amenityData.description}</p>
                    </div>
                    <div className="grid items-end justify-start">
                      <button className="flex items-center gap-x-1 font-semibold underline text-sm">
                        Explore the {amenityData.title}{" "}
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="md:grid grid-cols-1 grid-rows-1 col-span-2 gap-0.5 order-1 md:order-2 hidden">
                    <Image
                      src={amenityData.headImage}
                      alt=""
                      height={1000}
                      width={1000}
                      className="h-[500px] object-cover object-center"
                    />
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </Feature>
      </section>

      {toggle === "Ground Floor" && !isTransitioning ? (
        <GFAmenitiesDetails />
      ) : toggle === "Bedroom Area" ? (
        <BAAmenitiesDetails />
      ) : toggle === "Outdoor" ? (
        <OAAmenitiesDetails />
      ) : (
        ""
      )}
    </main>
  );
}

export const GFAmenitiesDetails = (details: any) => {
  return (
    <main>
      <section className="grid grid-cols-1 md:grid-cols-3 bg-gray-900 text-white md:px-5 md:py-16 font-medium h-full">
        <div className="md:flex flex-col justify-center items-center w-auto px-10 py-8 text-sm gap-2 bg-[#fcf4e9] text-black hidden">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-4xl font-medium font-teko">Ground Floor</h2>
          </div>
        </div>

        <Image
          src={"/image/room-2-1.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/image-2.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/gf-new-2.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/hero.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/gf-new-3.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/gf-new-7.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/gf-new-4.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/gf-new-8.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/room-1-2.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/gf-new-5.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/room-1-4.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />
      </section>
    </main>
  );
};

export const BAAmenitiesDetails = (details: any) => {
  return (
    <main>
      <section className="grid grid-cols-1 md:grid-cols-3 bg-gray-900 text-white md:px-5 md:py-16 font-medium h-full">
        <div className="md:flex flex-col justify-center items-center w-auto px-10 py-8 text-sm gap-2 bg-[#fcf4e9] text-black hidden">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-4xl font-medium font-teko">Bedroom Area</h2>
          </div>
        </div>

        <Image
          src={"/image/overview-3.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/ba-new-1.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />
      </section>
    </main>
  );
};

export const OAAmenitiesDetails = (details: any) => {
  return (
    <main>
      <section className="grid grid-cols-1 md:grid-cols-3 bg-gray-900 text-white md:px-5 md:py-16 font-medium h-full">
        <div className="md:flex flex-col justify-center items-center w-auto px-10 py-8 text-sm gap-2 bg-[#fcf4e9] text-black hidden">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-4xl font-medium font-teko">Outdoor</h2>
          </div>
        </div>

        <Image
          src={"/image/oa-new-1.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="block md:hidden h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/outdoor.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />

        <Image
          src={"/image/oa-new-2.jpg"}
          alt=""
          height={1000}
          width={1000}
          className="h-[350px] object-cover object-center"
        />
      </section>
    </main>
  );
};
