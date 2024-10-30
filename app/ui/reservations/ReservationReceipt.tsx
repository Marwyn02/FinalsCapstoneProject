/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Reservation } from "@/app/lib/types/types";

import Map from "../map/Map";
import { ChevronRight } from "lucide-react";

const ReservationReceipt = ({
  reservation,
}: {
  reservation: Reservation | null;
}) => {
  if (!reservation) {
    return <p className="text-center font-semibold pt-12">Loading...</p>;
  }

  return (
    <section className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-5xl font-semibold font-teko">
          Thank you,{" "}
          {reservation.firstName ? reservation.firstName : "Unknown user"}.
        </h2>

        <div className="space-y-5">
          <h4 className="text-2xl font-semibold">
            Your reservation is{" "}
            <span className="text-green-800">confirmed</span>
          </h4>
        </div>
      </div>

      <section>
        <p className="text-gray-700 mb-1">
          Please review your reservation details below.
        </p>

        <section className="grid grid-cols-2 divide-x-[1.5px] text-[15px] bg-white rounded-lg p-10">
          <div className="pr-10 space-y-10">
            <section className="flex justify-between items-start">
              <div>
                <p className="font-bold uppercase">Reservation ID</p>
                <p className="text-gray-600">{reservation.reservationId}</p>
              </div>
              <div className="text-end">
                <p className="font-semibold text-green-800">
                  {reservation.modeOfPayment}
                </p>
                <p className="text-gray-500">
                  {new Intl.DateTimeFormat("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }).format(reservation.createdAt)}
                </p>
              </div>
            </section>

            <div className="space-y-5">
              <div>
                <p className="font-bold text-xs uppercase text-gray-800">
                  Full name
                </p>
                <p className="text-gray-600">
                  {reservation.prefix +
                    " " +
                    reservation.firstName +
                    " " +
                    reservation.lastName}
                </p>
              </div>

              <div>
                <p className="font-bold text-xs uppercase">Email Address</p>
                <p className="text-gray-600">{reservation.email}</p>
              </div>

              <div>
                <p className="font-bold text-xs uppercase">Phone number</p>
                <p className="text-gray-600">{reservation.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="pl-10 space-y-4">
            {/* Check in and check out */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="font-bold text-xs uppercase">Check in</p>
                <p className="text-gray-600">
                  {reservation.checkIn &&
                    new Date(reservation.checkIn).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </p>
              </div>

              <div>
                <p className="font-bold text-xs uppercase">Check out</p>
                <p className="text-gray-600">
                  {reservation.checkOut &&
                    new Date(reservation.checkOut).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </p>
              </div>
            </div>

            {/* Guest */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs border-b pb-2">Guest</h5>

              <div className="grid grid-cols-2 gap-y-2 items-start">
                <div className="text-start">
                  <p className="font-bold text-xs uppercase">Adults</p>
                  <p className="text-gray-600">{reservation.adult}</p>
                </div>

                <div className="text-end">
                  <p className="font-bold text-xs uppercase">Children</p>
                  <p className="text-gray-600">{reservation.children}</p>
                </div>

                <div className="text-start">
                  <p className="font-bold text-xs uppercase">PWD's</p>
                  <p className="text-gray-600">0</p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-3 border-t">
              <div className="grid grid-cols-2 gap-y-2 items-start pt-3">
                <div className="text-start space-y-2">
                  <p className="font-bold text-xs uppercase">Balance Left</p>
                  <p className="text-gray-900 text-xl font-bold">
                    ₱{reservation.payment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Address */}
        <div className="mt-10 grid grid-cols-3">
          <div className="col-span-1 space-y-4">
            <h3 className="font-bold uppercase">Address</h3>

            <p className="text-gray-600 text-sm font-medium">
              114 Purok 2 Santiago Sur,
              <br /> San Fernando,
              <br /> La Union
            </p>

            <a href="https://www.google.com/maps/dir//Purok+2+Santiago+Sur,+City+of+San+Fernando+La+Union,+Purok+2,+San+Fernando,+La+Union/@16.6081015,120.3312582,15.2z/data=!4m9!4m8!1m0!1m5!1m1!1s0x33918f47ac568cc1:0x1ef6a685c36c829!2m2!1d120.3349024!2d16.6098255!3e0?entry=ttu&g_ep=EgoyMDI0MTAyNy4wIKXMDSoASAFQAw%3D%3D">
              <div className="flex items-center gap-x-1 text-sm font-medium text-blue-400 underline">
                <p>Direct me to the house</p>{" "}
                <ChevronRight className="h-4 w-4" />
              </div>
            </a>
          </div>

          <Map />
        </div>
      </section>
    </section>
  );
};

export default ReservationReceipt;
