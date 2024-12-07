/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { Reservation } from "@/app/lib/types/types";
import { ArrowDownToLine, ChevronRight, LoaderCircle } from "lucide-react";
import html2canvas from "html2canvas";

import Map from "../../../components/map/Map";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getReservation } from "../api/route";

const ReservationReceipt = ({
  initialReservation,
  id,
}: {
  initialReservation: Reservation | null;
  id: string;
}) => {
  const [reservation, setReservation] = useState<Reservation | null>(
    initialReservation
  );

  useEffect(() => {
    if (!reservation) {
      const interval = setInterval(async () => {
        const res = await getReservation(id); // Your API endpoint
        if (res) {
          setReservation(res);
          clearInterval(interval); // Stop re-fetching once reservation is found
        }
      }, 5000);

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [reservation]);

  const captureAndDownload = (reservation: Reservation) => {
    const element = document.getElementById("invoice"); // Capture the section with ID "invoice"

    if (element) {
      html2canvas(element).then((canvas) => {
        // Convert the canvas to an image
        const imgData = canvas.toDataURL("image/png");

        // Create a link to download the image
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `Reservation_Receipt_${reservation.reservationId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  if (!reservation) {
    return (
      <p className="text-center font-semibold pt-12 h-screen">
        <LoaderCircle className="h-6 w-6 animate-spin" />
      </p>
    );
  }

  return (
    <section>
      <div className="space-y-8 pt-28 pb-10 md:pb-10 mx-0 md:mx-28">
        <div className="space-y-6 px-4 md:px-0">
          <h2 className="text-5xl font-semibold font-teko">
            Thank you, {reservation?.firstName ? reservation?.firstName : ""}.
          </h2>

          <div className="space-y-5">
            <h4 className="text-2xl font-semibold">
              Your reservation is{" "}
              <span className="text-green-800">{reservation?.status}.</span>
            </h4>
          </div>
        </div>

        <section>
          <div className="flex justify-between items-end mb-3 px-3 md:px-0">
            <p className="text-gray-700">
              Please review your reservation details below.
            </p>

            <Button
              className="w-min"
              onClick={() => captureAndDownload(reservation)}
            >
              <div className="flex items-center gap-x-2">
                <ArrowDownToLine className="w-4 h-4" />
                <p>Download Receipt</p>
              </div>
            </Button>
          </div>

          <section
            className="grid grid-cols-1 md:grid-cols-2 md:divide-x-[1.5px] text-[15px] bg-white rounded-none md:rounded-lg px-5 py-8 md:p-10"
            id="invoice"
          >
            <div className="md:pr-10 space-y-10">
              <section className="grid md:flex md:justify-between md:items-start gap-y-5 md:gap-y-0 border-b border-gray-700 md:border-0 pb-5 md:pb-0">
                <div className="order-2 md:order-1">
                  <p className="font-bold uppercase">Reservation ID</p>
                  <p className="text-gray-600">{reservation?.reservationId}</p>
                </div>
                <div className="order-1 md:order-2 text-start md:text-end">
                  <p className="font-semibold text-green-800">
                    {reservation?.modeOfPayment}
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
                    }).format(reservation?.createdAt)}
                  </p>
                </div>
              </section>

              <div className="space-y-5">
                <div>
                  <p className="font-bold text-xs uppercase text-gray-800">
                    Full name
                  </p>
                  <p className="text-gray-600">
                    {reservation?.prefix +
                      " " +
                      reservation?.firstName +
                      " " +
                      reservation?.lastName}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-xs uppercase">Email Address</p>
                  <p className="text-gray-600">{reservation?.email}</p>
                </div>

                <div>
                  <p className="font-bold text-xs uppercase">Phone number</p>
                  <p className="text-gray-600">{reservation?.phoneNumber}</p>
                </div>
              </div>
            </div>

            <div className="md:pl-10 pt-8 md:pt-0 space-y-4">
              {/* Check in and check out */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="font-bold text-xs uppercase">Check in</p>
                  <p className="text-gray-600">
                    {reservation?.checkIn &&
                      new Date(reservation?.checkIn).toLocaleString("en-US", {
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
                    {reservation?.checkOut &&
                      new Date(reservation?.checkOut).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                  </p>
                </div>
              </div>

              {/* Guest */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs border-b pb-2">Guest</h5>

                <div className="grid grid-cols-2 gap-y-2 items-start">
                  <div className="text-start">
                    <p className="font-bold text-xs uppercase">Adults</p>
                    <p className="text-gray-600">{reservation?.adult}</p>
                  </div>

                  <div className="text-end">
                    <p className="font-bold text-xs uppercase">Children</p>
                    <p className="text-gray-600">{reservation?.children}</p>
                  </div>

                  <div className="text-start">
                    <p className="font-bold text-xs uppercase">PWD's</p>
                    <p className="text-gray-600">{reservation?.pwd}</p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="space-y-1.5 border-t pt-3">
                <div className="flex justify-between items-start gap-x-2 ">
                  <div>
                    <h5 className="font-bold text-xs uppercase pb-1">
                      Downpayment
                    </h5>

                    {reservation?.downpayment ? (
                      <p className="text-sm text-green-600 font-medium">
                        {Number(reservation?.downpayment).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        ) +
                          " " +
                          "PHP"}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div>
                    <h5 className="font-bold text-xs uppercase pb-1 text-end">
                      Balance
                    </h5>
                    <p className="text-gray-900 text-xl font-bold text-end">
                      {Number(reservation?.payment).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) +
                        " " +
                        "PHP"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Address */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3">
            <div className="col-span-1 space-y-2 md:space-y-4 px-4 md:px-0 mb-10 md:mb-0">
              <h3 className="font-bold text-lg md:text-base uppercase">
                Address
              </h3>

              <p className="text-gray-600 text-base md:text-sm font-medium">
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

            <Map height={300} />
          </div>
        </section>
      </div>

      <div className="py-10 md:py-5 px-5 lg:px-28 bg-stone-900 text-white font-semibold">
        <p>
          Need assistance? Have a question? Simply reach out to us through our
          contact us{" "}
          <Link
            href={"/contact"}
            className="text-[#dbb07c] hover:text-yellow-700 duration-300"
          >
            page
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default ReservationReceipt;
