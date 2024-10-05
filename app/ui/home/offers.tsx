"use client";

import { offers } from "@/app/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import {
  AirVent,
  Armchair,
  BedDouble,
  CarFront,
  CookingPot,
  GlassWater,
  Microwave,
  Refrigerator,
  ShowerHead,
  Sofa,
  Utensils,
  Wifi,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";

const iconMapping = {
  CarFront: CarFront,
  ShowerHead: ShowerHead,
  AirVent: AirVent,
  Armchair: Armchair,
  BedDouble: BedDouble,
  UtensilsCrossed: UtensilsCrossed,
  CookingPot: CookingPot,
  GlassWater: GlassWater,
  Microwave: Microwave,
  Refrigerator: Refrigerator,
  Sofa: Sofa,
  Utensils: Utensils,
  Wifi: Wifi,
};

export default function Offers() {
  const bathroomData = offers.filter((offer) => offer.cat === "bathroom");
  const kitchenData = offers.filter((offer) => offer.cat === "kitchen");
  const livingData = offers.filter((offer) => offer.cat === "living-room");

  return (
    <>
      <section className="border-y-2 bg-gray-100 border-gray-800 px-5 pt-5">
        <div>
          <h2 className="text-4xl font-medium font-teko">What we offer</h2>
        </div>

        <div className="space-y-7 mt-7">
          <section>
            <h3 className="text-xl font-medium font-teko text-center">
              Living room
            </h3>
            <div className="flex justify-center">
              <div className="grid grid-flow-col auto-cols-max gap-x-8 py-3 text-base">
                {livingData.map((l) => {
                  const IconComponent =
                    iconMapping[l.icon as keyof typeof iconMapping];

                  return (
                    <div
                      key={l.id}
                      className="flex flex-row text-center justify-center items-center font-light"
                    >
                      {IconComponent && (
                        <IconComponent strokeWidth={1.5} className="h-6 w-6" />
                      )}
                      <p className="ml-2">{l.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Kitchen Offers */}
          <section>
            <h3 className="text-xl font-medium font-teko text-center">
              Kitchen and dining
            </h3>
            <div className="flex justify-center">
              <div className="grid grid-flow-col auto-cols-max gap-x-8 py-3 text-base">
                {kitchenData.map((k) => {
                  const IconComponent =
                    iconMapping[k.icon as keyof typeof iconMapping];

                  return (
                    <div
                      key={k.id}
                      className="flex flex-row text-center justify-center items-center font-light"
                    >
                      {IconComponent && (
                        <IconComponent strokeWidth={1.5} className="h-6 w-6" />
                      )}
                      <p className="ml-2">{k.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Bathroom Offers */}
          <section>
            <h3 className="text-xl font-medium font-teko text-center">
              Bathroom
            </h3>
            <div className="flex justify-center">
              <div className="grid grid-flow-col auto-cols-max gap-x-8 py-3 text-base">
                {bathroomData.map((b) => {
                  const IconComponent =
                    iconMapping[b.icon as keyof typeof iconMapping];

                  return (
                    <div
                      key={b.id}
                      className="flex flex-row text-center justify-center items-center font-light"
                    >
                      {IconComponent && (
                        <IconComponent strokeWidth={1.5} className="h-6 w-6" />
                      )}
                      <p className="ml-2">{b.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="flex justify-center">
            <Link href={"/amenities"}>
              <Button type="button" className="max-w-min px-6 py-3">
                Show all amenities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
