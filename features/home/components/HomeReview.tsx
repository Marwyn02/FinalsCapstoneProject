/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Review } from "@/app/lib/types/types";

import { Rating } from "@mui/material";
import {
  calculateAverageRatingForProperty,
  calculateOverallAverageRating,
  getRatingText,
} from "@/app/utils/ReviewHelpers";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const propertyLabels: Record<keyof Review, string> = {
  staff: "Staff",
  valueForMoney: "Value for money",
  facilities: "Facilities",
  location: "Location",
  cleanliness: "Cleanliness",
  comfort: "Comfort",
  id: "",
  reviewId: "",
  firstName: "",
  lastName: "",
  message: "",
  status: "",
  reservationId: "",
  createdAt: "",
  updatedAt: "",
};

const HomeReview = ({ reviews }: { reviews: Review[] }) => {
  const properties: (keyof Review)[] = useMemo(
    () => [
      "staff",
      "valueForMoney",
      "facilities",
      "location",
      "cleanliness",
      "comfort",
    ],
    []
  );

  // To compute the total for all reviews
  const overallAverageRating = useMemo(
    () => calculateOverallAverageRating(reviews, properties),
    [reviews, properties]
  );
  return (
    <main className="space-b-5">
      <section className="space-y-10 px-5 md:px-16 md:mt-10 mb-0 md:mb-20 md:mx-24 py-16 md:py-10 md:pb-24 border-b border-gray-800">
        <div>
          <h2 className="text-4xl font-medium font-teko">Our Rating</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 px-0 py-5">
            <div className="md:col-span-2 grid place-items-center md:flex text-center md:text-start md:items-start gap-x-5 gap-y-1 md:gap-y-0">
              {overallAverageRating !== null ? (
                <Rating
                  name="half-rating"
                  defaultValue={Number(overallAverageRating.toFixed(1))}
                  precision={0.5}
                  readOnly
                  size="large"
                  className="order-3 md:order-1"
                />
              ) : (
                <p className="text-sm">Loading rating...</p>
              )}

              <p className="order-1 md:order-2 text-6xl font-bold">
                {overallAverageRating ? overallAverageRating.toFixed(1) : "0"}
              </p>
              <div className="order-2 md:order-3">
                <p className="text-lg font-semibold">
                  {overallAverageRating
                    ? getRatingText(overallAverageRating)
                    : "No ratings yet"}
                </p>

                <Link
                  href={"/memories-and-reviews"}
                  className="hidden md:block text-sm text-gray-500 hover:underline"
                >
                  {reviews.length > 1
                    ? `${reviews.length} reviews`
                    : `${reviews.length} review`}
                </Link>
              </div>

              {/* Show this see all reviews in mobile not in desktop */}
              <Link
                href={"/memories-and-reviews"}
                className="order-4 md:order-4 md:hidden text-sm text-gray-500 hover:underline"
              >
                {reviews.length > 1
                  ? `${reviews.length} reviews`
                  : `${reviews.length} review`}
              </Link>
            </div>

            {/* Quality stars */}
            <div className="col-span-3 grid grid-cols-2 space-y-1 gap-y-2 gap-x-8 mt-7 md:mt-0">
              {/* Loop through each property and display the average rating and corresponding label */}
              {properties.map((property) => {
                const averageRating = calculateAverageRatingForProperty(
                  reviews,
                  property
                );
                return (
                  <div key={property} className="border-r border-gray-400 py-1">
                    <p className="text-sm font-normal text-gray-400">
                      {averageRating ? averageRating.toFixed(1) : "0.0"}
                    </p>
                    <h4 className="text-gray-700">
                      {propertyLabels[property]}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The triangle thing on the home page */}
      {/* <div className="pt-10 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[40px] border-transparent border-b-black mx-auto"></div> */}
    </main>
  );
};

export default HomeReview;
