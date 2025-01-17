"use client";

import Image from "next/image";
import React from "react";

const ServicesPage = () => {
  return (
    <section className="md:mx-24 pt-24 md:pb-24">
      <div className="-space-y-1 px-5 md:px-10">
        <h1 className="text-4xl font-medium font-teko">
          Experience the Comfort of Home
        </h1>
        <p>Your Serene Retreat, Enhanced by Our Services</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 mt-5 md:px-10">
        <div className="bg-white rounded-b-lg">
          <Image
            src={"/image/laundry.jpg"}
            alt="image"
            height={1000}
            width={1000}
            className="h-[350px]"
          />
          <div className="p-7 pb-9 space-y-4">
            <h2 className="text-2xl font-medium font-teko">Laundry Service</h2>
            <div className="pb-2">
              <p className="font-semibold">Self-service laundry</p>
              <p>
                Enjoy the convenience of our in-house laundry facilities,
                equipped with modern washing and drying machines.
              </p>
            </div>

            <div className="grid grid-cols-2 divide-x-[1px] divide-gray-800 space-y-2 text-sm font-medium">
              <div className="space-y-2">
                <p>Washing machines</p>
                <p>Dryers</p>
              </div>
              <p className="pl-14">Detergent and fabric softener dispensers</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <Image
            src={"/image/coffee.jpg"}
            alt="image"
            height={1000}
            width={1000}
            className="h-[350px]"
          />

          <div className="p-7 pb-9 space-y-4">
            <h2 className="text-2xl font-medium font-teko">Coffee Shop</h2>
            <div className="pb-2">
              <p className="font-semibold">Daily Brew</p>
              <p>
                Start your day right with a cup of our freshly brewed coffee.
                Our cozy coffee shop offers a variety of hot and cold beverages
                to suit your taste.
              </p>
            </div>

            <div className="grid grid-cols-2 divide-x-[1px] divide-gray-800 space-y-2 text-sm font-medium">
              <p>Espresso-based drinks (latte, cappuccino, americano)</p>
              <p className="pl-14">Tea (black, green, herbal)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
