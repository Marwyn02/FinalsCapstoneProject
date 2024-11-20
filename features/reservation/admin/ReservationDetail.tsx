/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Link from "next/link";
import { Reservation } from "@/app/lib/types/types";
import { ArrowLeft, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

const ReservationDetail = ({
  reservation,
}: {
  reservation: Reservation | null;
}) => {
  if (!reservation) {
    return (
      <div className="flex flex-col justify-center items-center gap-y-2">
        <p className="text-center text-xl font-semibold">
          Reservation not found or wrong id.
        </p>
        <Link
          href={"/admin-dashboard/reservations"}
          className="text-blue-500 font-bold uppercase hover:underline duration-300"
        >
          Go back.
        </Link>
      </div>
    );
  }

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
    } else {
      console.error("Invoice section not found.");
    }
  };

  return (
    <main>
      <section className="flex justify-between items-center">
        <Link href={"/admin-dashboard/reservations"}>
          <Button className="flex items-center text-center gap-x-2 w-min px-8">
            <ArrowLeft className="h-4 w-4" />
            <p>Back</p>
          </Button>
        </Link>

        <Button
          className="w-min"
          onClick={() => captureAndDownload(reservation)}
        >
          <div className="flex items-center gap-x-2">
            <ArrowDownToLine className="w-4 h-4" />
            <p>Download Receipt</p>
          </div>
        </Button>
      </section>

      <section className="mt-5">
        <p className="text-gray-700 mb-1 px-4 md:px-0">
          Please review your reservation details below.
        </p>

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
                  <p className="text-gray-600">0</p>
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

                  {reservation?.downpayment && (
                    <p className="text-sm text-green-600 font-medium">
                      {Number(reservation?.downpayment).toLocaleString(
                        "en-US",
                        {
                          maximumFractionDigits: 0,
                        }
                      ) +
                        " " +
                        "PHP"}
                    </p>
                  )}
                </div>

                <div>
                  <h5 className="font-bold text-xs uppercase pb-1 text-end">
                    Balance
                  </h5>
                  <p className="text-gray-900 text-xl font-bold text-end">
                    {Number(reservation?.payment).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    }) +
                      " " +
                      "PHP"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default ReservationDetail;
