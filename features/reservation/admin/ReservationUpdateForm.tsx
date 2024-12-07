/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Reservation, SpecialPrice, Voucher } from "@/app/lib/types/types";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ReservationUpdate } from "../api/ReservationUpdate";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, CountButton } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  calculateTotalDatePrice,
  computeNights,
  guestCountHandler,
  setPricesForMonth,
} from "@/app/utils/ReservationHelpers";

const formSchema = z.object({
  guestAdult: z
    .number({
      message: "Guest is required!",
    })
    .min(1, { message: "You haven't set your adult count yet." })
    .max(15)
    .optional(),
  guestChildren: z.number().max(15).optional(),
  guestPWD: z.number().max(15).optional(),
  date: z.object(
    {
      from: z.date({ message: "Your check-in date is missing." }).optional(),
      to: z.date({ message: "Check out date is required!" }).optional(),
    },
    { message: "Check-in and check-out is required!" }
  ),
});

const ReservationUpdateForm = ({
  singleReservation,
  reservations,
  specialPrices,
}: {
  singleReservation: Reservation | null;
  reservations: Reservation[];
  specialPrices: SpecialPrice[];
  vouchers: Voucher[];
}) => {
  const router = useRouter();
  const [adultCount, setAdultCount] = useState<number>(
    Number(singleReservation?.adult) | 0
  );
  const [childrenCount, setChildrenCount] = useState<number>(
    Number(singleReservation?.children) | 0
  );
  const [pwdCount, setPwdCount] = useState<number>(0);
  const [nightCount, setNightCount] = useState<number>(0);
  const [bookingPrice, setBookingPrice] = useState<number>(
    Number(singleReservation?.payment) | 0
  );
  const [guestCountPrice, setGuestCountPrice] = useState<number>(0);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [selectedLastDay, setSelectedLastDay] = useState<Date | null>(null);
  const [submitDisable, setSubmitDisable] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [updatedPrice, setUpdatedPrice] = useState(0);

  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestAdult: Number(singleReservation?.adult),
      guestChildren: Number(singleReservation?.children),
      guestPWD: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSubmitDisable(true);
    if (data.date.from) {
      const fromDate = new Date(data.date.from);
      fromDate.setHours(12, 0, 0, 0); // Set to 12:00:00 PM
    }
    if (data.date.to) {
      const toDate = new Date(data.date.to);
      toDate.setHours(10, 0, 0, 0); // Set to 10:00:00 AM
    }

    const values = {
      checkIn: data.date.from ?? singleReservation?.checkIn,
      checkOut: data.date.to ?? singleReservation?.checkOut,
      adult: data.guestAdult?.toString() ?? singleReservation?.adult,
      children: data.guestChildren?.toString() ?? singleReservation?.children,
      pwd: data.guestPWD?.toString(),
      payment: updatedPrice.toString(),
    };

    if (singleReservation?.reservationId && values) {
      const response = await ReservationUpdate(
        singleReservation?.reservationId,
        values
      );

      if (response) {
        router.push("/admin-dashboard/reservations");
      }
    }
  }

  const [specificDatePrices, setSpecificDatePrices] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    if (specialPrices) {
      const datePriceMap = specialPrices.reduce((acc, { date, price }) => {
        const formattedDate = date.toISOString().split("T")[0];
        acc[formattedDate] = price;
        return acc;
      }, {} as Record<string, number>);
      setSpecificDatePrices(datePriceMap);
    }
  }, [specialPrices]);

  // Function to set the prices to the dates of every months
  const datePrices = useMemo(
    () => setPricesForMonth(specificDatePrices),
    [specificDatePrices]
  );

  //   Function formatter for the calendar to display the prices in every dates in calendar
  const formatDay: any = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const startDate = new Date("2024-08-31");

    if (date < startDate) {
      return (
        <div className="day-cell">
          <span>{date.getDate()}</span>
          <div className="price text-[10px] text-gray-400">Not available</div>
        </div>
      );
    }

    const isLastSelectedDate =
      date.getTime() === (selectedLastDay?.getTime() ?? null);

    const isSpecialPrice = !!specificDatePrices[dateString];

    const price =
      !isLastSelectedDate && datePrices[dateString]
        ? `₱${datePrices[dateString].toLocaleString("en-US")}`
        : "";

    const priceClass = isSpecialPrice ? "text-yellow-600 font-bold" : "";

    return (
      <div className="day-cell">
        <span className={`font-medium ${priceClass}`}>{date.getDate()}</span>
        {price && (
          <div className={`price text-[12px] ${priceClass}`}>{price}</div>
        )}
      </div>
    );
  };

  // Side effect the disable dates
  useEffect(() => {
    const fetchReservations = async () => {
      const disabledDatesArray = reservations
        .filter(
          ({ status }) =>
            status !== "canceled" && status !== "paid" && status !== "updating"
        )
        .flatMap(({ checkIn, checkOut }) => {
          const dates = [];
          let currentDate = new Date(checkIn);

          // Get the dates from and between and last on the checking
          while (currentDate <= checkOut) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }

          return dates;
        });

      setDisabledDates(disabledDatesArray);
    };
    fetchReservations();
  }, []);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Exclude current reservation dates from the disabled dates list
    const isWithinUpdateRange =
      singleReservation?.checkIn &&
      singleReservation?.checkOut &&
      date >= singleReservation?.checkIn &&
      date <= singleReservation?.checkOut;

    if (isWithinUpdateRange) return false;

    // Check if date is in other reservations or beyond max reservation period
    const isDateInOtherReservations = disabledDates.some(
      (disabledDate) => disabledDate.getTime() === date.getTime()
    );
    return isDateInOtherReservations;
  };

  const checkRangeForConflicts = (from: Date, to: Date) => {
    const daysInRange = [];
    let currentDate = new Date(from);

    while (currentDate <= to) {
      daysInRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return daysInRange.some((date) => isDateDisabled(date));
  };

  // Function to set range based on button click
  const handleRangeClick = (startDate: Date, daysToAdd: number) => {
    const resultDate = new Date(startDate);
    resultDate.setDate(resultDate.getDate() + daysToAdd);

    // Check for conflicts before updating state
    if (checkRangeForConflicts(startDate, resultDate)) {
      alert(
        "The selected date range includes reserved dates. Please choose another."
      );
    } else {
      const totalPrice = calculateTotalDatePrice(
        startDate,
        resultDate,
        datePrices
      );
      setBookingPrice(totalPrice);
      setSelectedLastDay(resultDate);
      setDate({ from: date?.from, to: resultDate });
      return resultDate;
    }
  };

  // const applyVoucher = () => {
  //   // Check if the entered code matches any code in the vouchers array
  //   const matchedVoucher = vouchers.find(
  //     (voucher) => voucher.code === voucherCode
  //   );

  //   if (
  //     matchedVoucher?.discountPercent &&
  //     matchedVoucher.discountPercent !== 0
  //   ) {
  //     const discountPercent =
  //       (bookingPrice * matchedVoucher.discountPercent) / 100;
  //     setDiscount(discountPercent);
  //     setDiscountedPrice(bookingPrice - discountPercent);
  //     setCode(matchedVoucher.code);
  //     setVoucherErrorCode("");
  //   } else if (
  //     matchedVoucher?.discountAmount &&
  //     matchedVoucher.discountAmount !== 0
  //   ) {
  //     setDiscount(matchedVoucher.discountAmount);
  //     setDiscountedPrice(bookingPrice - matchedVoucher.discountAmount);
  //     setCode(matchedVoucher.code);
  //     setVoucherErrorCode("");
  //   } else {
  //     setVoucherErrorCode("Invalid voucher code");
  //   }
  // };

  useEffect(() => {
    if (date?.from && date?.to) {
      const from = new Date(date.from);
      const to = new Date(date.to);

      const totalNights = computeNights(from, to);
      setNightCount(totalNights);
    } else {
      setNightCount(0);
    }
  }, [date]);

  // Check if the fields are filled to undisabled the button
  useEffect(() => {
    if (date?.from && date?.to && adultCount > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [date, adultCount]);

  const updateExceedFee = (adultCount: number, childCount: number) => {
    const excessAdults = Math.max(0, adultCount - 8);
    const excessChildren = Math.max(0, childCount - 8);
    const totalExceedFee = excessAdults * 300 + excessChildren * 300;

    setGuestCountPrice(totalExceedFee * nightCount);
  };

  // Update the exceed fee whenever adultCount changes
  useEffect(() => {
    updateExceedFee(adultCount, childrenCount);
  }, [adultCount, childrenCount, nightCount]);

  if (!singleReservation) {
    return <p>Loading...</p>;
  }

  return (
    <Form {...form}>
      {/* Details section */}
      <section className="px-28 py-5 bg-white grid grid-cols-3 gap-x-5 divide-x-[1px] divide-gray-700">
        <div className="col-span-1 col-start-1 space-y-2 ">
          <p className="font-bold">Details</p>
          <div className="pb-2">
            <p className="font-medium text-sm">Guest Name</p>
            <p className="font-semibold">
              {singleReservation.firstName + " " + singleReservation.lastName}
            </p>
          </div>

          <div className="grid grid-cols-2">
            <div>
              <p className="font-medium text-sm">Check-in</p>
              <p>{format(singleReservation.checkIn, "MMMM dd yyyy")}</p>
            </div>

            <div>
              <p className="font-medium text-sm">Check-out</p>
              <p>{format(singleReservation.checkOut, "MMMM dd yyyy")}</p>
            </div>
          </div>
        </div>

        <div className="pl-5 space-y-2">
          <p className="font-bold">Guests</p>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="font-medium text-sm">Adult</p>
              <p>{singleReservation.adult}</p>
            </div>

            <div className="text-end">
              <p className="font-medium text-sm">Children</p>
              <p>{singleReservation.children}</p>
            </div>

            <div>
              <p className="font-medium text-sm">PWD</p>
              <p>{singleReservation.pwd}</p>
            </div>
          </div>
        </div>

        <div className="pl-5 space-y-2">
          <p className="font-bold">Payment</p>
          <div className="pb-2">
            <p className="font-medium text-sm">Mode of Payment</p>
            <p className="font-semibold">{singleReservation.modeOfPayment}</p>
          </div>

          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="font-medium text-sm">Downpayment</p>
              <p>
                {Number(singleReservation.downpayment).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                PHP
              </p>
            </div>

            <div className="text-end">
              <p className="font-medium text-sm">Balance</p>
              <p className="font-bold text-lg">
                {Number(singleReservation.payment).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                PHP
              </p>
            </div>
          </div>
        </div>
      </section>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-4 md:px-16 space-y-5 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:items-start gap-y-5 md:gap-y-10 px-3 md:px-0 md:py-12">
          {/* Calendar */}
          <section className="space-y-3 lg:col-span-2 pb-3 border-b border-gray-700 md:border-0 md:pb-0">
            <div className="space-y-4 md:px-3 pt-5 md:pt-0 md:pb-0 pb-2">
              <h4 className="text-2xl text-center font-teko uppercase tracking-widest">
                Select your stay
              </h4>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="block text-base font-light md:mb-10 uppercase tracking-widest">
                      Check in - Check out
                    </FormLabel>

                    <FormControl>
                      <Calendar
                        mode="range"
                        numberOfMonths={2}
                        selected={{
                          from: field.value?.from ?? undefined,
                          to: date?.to || field.value?.to || undefined,
                        }}
                        onSelect={(value) => {
                          if (value?.from && value?.to) {
                            if (checkRangeForConflicts(value.from, value.to)) {
                              alert(
                                "The selected range includes reserved dates. Please choose another."
                              );
                              field.onChange(undefined); // Reset the field to undefined
                              setDate(undefined);
                              setSelectedLastDay(null);
                            } else if (
                              value.from.getTime() === value.to.getTime()
                            ) {
                              // Set `to` as undefined to clear the range
                              field.onChange({
                                from: value.from,
                                to: undefined,
                              });

                              setDate({ from: value.from, to: undefined });
                              setSelectedLastDay(null);
                            } else {
                              // If from and to are valid, proceed as usual
                              const totalPrice = calculateTotalDatePrice(
                                value.from,
                                value.to,
                                datePrices
                              );

                              field.onChange({
                                from: value.from,
                                to: value.to,
                              });
                              setBookingPrice(totalPrice);
                              setUpdatedPrice(
                                totalPrice -
                                  Number(singleReservation.downpayment)
                              );
                              setDate(value);
                              setSelectedLastDay(value.to);
                            }
                          } else if (value?.from && !value?.to) {
                            // Handle regular selection (only `from` is selected)
                            field.onChange({
                              from: value.from,
                              to: undefined,
                            });
                            setDate({
                              from: value.from,
                              to: undefined,
                            });
                            setSelectedLastDay(null);
                          } else {
                            // Clear selection if no date is selected
                            field.onChange(undefined);
                            setDate(undefined);
                            setSelectedLastDay(null);
                          }
                        }}
                        max={14}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          // Disable past dates
                          if (date <= today) {
                            return true;
                          }
                          const endDate = new Date(today);
                          endDate.setMonth(endDate.getMonth() + 3);
                          endDate.setDate(0);

                          if (date > endDate) {
                            return true;
                          }

                          const isSameDay = (date1: any, date2: any) => {
                            return (
                              date1.getFullYear() === date2.getFullYear() &&
                              date1.getMonth() === date2.getMonth() &&
                              date1.getDate() === date2.getDate()
                            );
                          };

                          if (
                            disabledDates.some((disabledDate) =>
                              isSameDay(date, disabledDate)
                            )
                          ) {
                            return true;
                          }
                          return false;
                        }}
                        formatters={{
                          formatWeekdayName: (day: Date) =>
                            day.toLocaleDateString("en-US", {
                              weekday: "short",
                            }),
                          formatDay,
                        }}
                        excludeDisabled
                      />
                    </FormControl>

                    <div className="grid grid-cols-1 md:grid-cols-2 md:flex md:justify-between items-center pt-2 md:pt-4">
                      {date?.from &&
                        (date.to ? (
                          <p className="text-base md:text-sm text-center font-semibold uppercase tracking-wide pb-5 md:pb-0">
                            {format(date.from, "MMMM dd yyyy")} -{" "}
                            {format(date.to, "MMMM dd yyyy")}
                          </p>
                        ) : (
                          <p className="text-base md:text-sm text-center font-semibold uppercase tracking-wide pb-5 md:pb-0">
                            {format(date.from, "MMMM dd yyyy")}
                          </p>
                        ))}

                      {date && date.from && (
                        <div className="flex gap-x-2 md:gap-x-1.5 justify-center md:justify-end">
                          {[3, 5, 7].map((days) => (
                            <button
                              key={days}
                              type="button"
                              className="px-3 py-1 border border-gray-900 hover:bg-gray-900 hover:text-white duration-300 text-base md:text-sm rounded-full"
                              onClick={() => {
                                if (date?.from) {
                                  const resultDate = handleRangeClick(
                                    date.from,
                                    days
                                  );
                                  field.onChange({
                                    from: date.from,
                                    to: resultDate,
                                  });
                                }
                              }}
                            >
                              {days} Nights
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Adult Children PWD */}
          <section className="space-y-1 lg:col-span-1 mt-5 md:mt-0">
            <div className="space-y-8 md:px-3 pb-10">
              {/* Adult */}
              <FormField
                control={form.control}
                name="guestAdult"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="font-light uppercase tracking-widest ">
                      <>
                        <p>Adults</p>
                        <p className="text-xs capitalize text-gray-400 tracking-normal">
                          Age 18+
                        </p>
                      </>
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-between md:justify-around items-center px-10 md:px-0">
                        <CountButton
                          className="h-10 w-10 p-2.5"
                          variant={"outline"}
                          size={"count"}
                          control="decrement"
                          onClick={() => {
                            guestCountHandler(
                              adultCount,
                              setAdultCount,
                              -1,
                              1,
                              15
                            );
                            field.onChange(adultCount - 1);
                          }}
                          disabled={adultCount <= 1}
                        />

                        <p className="font-medium text-lg cursor-default">
                          {adultCount}
                        </p>

                        <CountButton
                          className="h-10 w-10 p-2.5 duration-200"
                          variant={"outline"}
                          size={"count"}
                          control="increment"
                          onClick={() => {
                            guestCountHandler(
                              adultCount,
                              setAdultCount,
                              1,
                              1,
                              15
                            );
                            field.onChange(adultCount + 1);
                          }}
                          disabled={adultCount >= 15}
                        />
                      </div>
                    </FormControl>
                    {adultCount >= 8 && (
                      <p className="pt-5 text-red-600 px-0 md:mx-10">
                        Note: Every additional adult above 8 will incur an extra
                        charge of PHP 300.00 per head and per night.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Children */}
              <FormField
                control={form.control}
                name="guestChildren"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="font-light uppercase tracking-widest ">
                      <>
                        <p>Children</p>
                        <p className="text-xs capitalize text-gray-400 tracking-normal">
                          Ages 2-17
                        </p>
                      </>
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-between md:justify-around items-center px-10 md:px-0">
                        <CountButton
                          className="h-10 w-10 p-2.5"
                          variant={"outline"}
                          size={"count"}
                          control="decrement"
                          onClick={() => {
                            guestCountHandler(
                              childrenCount,
                              setChildrenCount,
                              -1,
                              0,
                              15
                            );
                            field.onChange(childrenCount - 1);
                          }}
                          disabled={childrenCount <= 0}
                        />

                        <p className="font-medium text-lg cursor-default">
                          {childrenCount}
                        </p>

                        <CountButton
                          className="h-10 w-10 p-2.5 duration-200"
                          variant={"outline"}
                          size={"count"}
                          control="increment"
                          onClick={() => {
                            guestCountHandler(
                              childrenCount,
                              setChildrenCount,
                              1,
                              0,
                              15
                            );
                            field.onChange(childrenCount + 1);
                          }}
                          disabled={childrenCount >= 15}
                        />
                      </div>
                    </FormControl>
                    {childrenCount >= 8 && (
                      <p className="pt-5 text-red-600 px-0 md:mx-10">
                        Note: Every additional child above 8 will incur an extra
                        charge of PHP 300.00 per head and per night.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PWD */}
              <FormField
                control={form.control}
                name="guestPWD"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="font-light uppercase tracking-widest ">
                      <>
                        <p>PWDs</p>
                        <p className="text-xs capitalize text-gray-400 tracking-normal">
                          Persons with disabilities
                        </p>
                      </>
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-between md:justify-around items-center px-10 md:px-0">
                        <CountButton
                          className="h-10 w-10 p-2.5"
                          variant={"outline"}
                          size={"count"}
                          control="decrement"
                          onClick={() => {
                            guestCountHandler(pwdCount, setPwdCount, -1, 0, 15);
                            field.onChange(pwdCount - 1);
                          }}
                          disabled={pwdCount <= 0}
                        />

                        <p className="font-medium text-lg cursor-default">
                          {pwdCount}
                        </p>

                        <CountButton
                          className="h-10 w-10 p-2.5 duration-200"
                          variant={"outline"}
                          size={"count"}
                          control="increment"
                          onClick={() => {
                            guestCountHandler(pwdCount, setPwdCount, 1, 0, 15);
                            field.onChange(pwdCount + 1);
                          }}
                          disabled={pwdCount >= 15}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Computation prices in desktop */}
            <AnimatePresence>
              {date && date.to && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <section className="text-base md:text-sm space-y-5 px-2 py-5 md:p-8 md:pb-1 md:px-14">
                    <section className="font-medium border-t border-gray-400 space-y-2">
                      <div className="space-y-2 pt-3">
                        {/* Subtotal */}
                        <div className="flex justify-between items-start font-normal">
                          <p>Subtotal</p>
                          <p>
                            {bookingPrice.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            PHP
                          </p>
                        </div>

                        {guestCountPrice > 0 && (
                          <div className="flex justify-between items-start font-normal">
                            <p>Exceed Fee</p>
                            <p>
                              {guestCountPrice > 0
                                ? guestCountPrice.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : "0"}{" "}
                              PHP
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between items-start text-red-400 font-normal">
                          <p>Downpayment Already Made</p>
                          <p>
                            -
                            {Number(
                              singleReservation.downpayment
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            PHP
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-start py-5">
                        <p className="font-bold">Total</p>
                        <p className="text-3xl md:text-xl font-semibold">
                          {(guestCountPrice + updatedPrice).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          PHP
                        </p>
                      </div>
                    </section>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="justify-center flex">
              <Button
                className="rounded-md w-full md:w-3/4 mx-auto"
                variant={"outline"}
                type="submit"
                disabled={isDisabled || submitDisable}
              >
                Update Reservation
              </Button>
            </div>
          </section>
        </div>
      </form>
    </Form>
  );
};

export default ReservationUpdateForm;
