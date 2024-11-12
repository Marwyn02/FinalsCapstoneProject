"use client";

import React from "react";
import useStore from "@/app/store/store";

const ReservationSummary = () => {
  const {
    checkInDate,
    checkOutDate,
    adultNumberGuest,
    childrenNumberGuest,
    pwdNumberGuest,
    bookingTotalPrice,
  } = useStore();
  return (
    <section className="order-1 md:order-2 col-span-1 md:col-span-2 space-y-8 px-8 pt-16 pb-10 md:p-10 bg-white h-fit border-b-2 border-gray-700">
      <h2 className="font-bold text-center">Stay summary</h2>
      <div className="space-y-5 text-[15px]">
        <div className="space-y-8 border-b pb-5">
          {/* Check dates */}
          <section className="space-y-1">
            <div className="flex justify-between">
              <p>Check in</p>
              <p className="font-medium">
                {checkInDate
                  ? new Date(checkInDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })
                  : "Not Assigned"}
              </p>
            </div>

            <div className="flex justify-between">
              <p>Check out</p>
              <p className="font-medium">
                {checkOutDate
                  ? new Date(checkOutDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })
                  : "Not Assigned"}
              </p>
            </div>
          </section>

          {/* Time arrival and departing */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <p>Arrival time</p>
              <p className="font-medium">2:00 PM</p>
            </div>
            <div className="flex justify-between">
              <p>Departing time</p>
              <p className="font-medium">10:00 AM</p>
            </div>
          </div>
        </div>

        {/* Guest count */}
        <section className="space-y-5 border-b pb-5">
          <h4 className="font-medium">Guests</h4>
          <div className="grid grid-cols-2 gap-1.5">
            <p>
              Adults: <span className="font-medium">{adultNumberGuest}</span>
            </p>
            <p>
              Children:{" "}
              <span className="font-medium">{childrenNumberGuest}</span>
            </p>
            <p>
              PWDs: <span className="font-medium">{pwdNumberGuest}</span>
            </p>
          </div>
        </section>

        {/* Payment display */}
        <div className="flex font-semibold justify-between md:pt-5 pb-2.5">
          <p>Total</p>
          <p className="text-3xl md:text-2xl font-bold md:font-semibold">
            {bookingTotalPrice.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}{" "}
            PHP
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReservationSummary;
