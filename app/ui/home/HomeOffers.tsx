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

type offerType = {
  id: number;
  title: string;
  icon: string;
  cat: string;
};

const HomeOffers = () => {
  const bathroomData = offers.filter((offer) => offer.cat === "bathroom");
  const kitchenData = offers.filter((offer) => offer.cat === "kitchen");
  const livingData = offers.filter((offer) => offer.cat === "living-room");

  return (
    <>
      <section className="border-b-2 md:border-y-2 border-gray-800 bg-gray-100 px-5 pt-0 md:pt-5">
        <div>
          <h2 className="text-4xl font-medium font-teko">What we offer</h2>
        </div>

        <div className="space-y-10 md:space-y-7 mt-7">
          {/* Living room offers */}
          <section>
            <h3 className="text-xl font-medium font-teko text-start md:text-center">
              Living room
            </h3>
            <div className="flex md:justify-center">
              <div className="grid grid-cols-2 md:grid-flow-col md:auto-cols-max gap-x-8 gap-y-3 md:gap-y-0 py-3 text-base">
                {livingData.map((l) => (
                  <OfferCard key={l.id} data={l} />
                ))}
              </div>
            </div>
          </section>

          {/* Kitchen Offers */}
          <section>
            <h3 className="text-xl font-medium font-teko text-start md:text-center">
              Kitchen and dining
            </h3>
            <div className="flex md:justify-center">
              <div className="grid grid-cols-2 md:grid-flow-col md:auto-cols-max gap-x-2 md:gap-x-8 gap-y-3 md:gap-y-0 py-3 text-base">
                {kitchenData.map((k) => (
                  <OfferCard key={k.id} data={k} />
                ))}
              </div>
            </div>
          </section>

          {/* Bathroom Offers */}
          <section>
            <h3 className="text-xl font-medium font-teko md:text-center">
              Bathroom
            </h3>
            <div className="flex md:justify-center">
              <div className="grid md:grid-flow-col md:auto-cols-max gap-x-8 gap-y-3 md:gap-y-0 py-3 text-base">
                {bathroomData.map((b) => (
                  <OfferCard key={b.id} data={b} />
                ))}
              </div>
            </div>
          </section>

          <div className="flex justify-center mt-10">
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
};

export default HomeOffers;

export const OfferCard = ({ data }: { data: offerType }) => {
  const IconComponent = iconMapping[data.icon as keyof typeof iconMapping];

  return (
    <div
      key={data.id}
      className="flex flex-row text-center md:justify-center items-center text-sm md:text-base font-light"
    >
      {IconComponent && (
        <IconComponent strokeWidth={1.5} className="h-4 w-4 md:h-6 md:w-6" />
      )}
      <p className="ml-2">{data.title}</p>
    </div>
  );
};
