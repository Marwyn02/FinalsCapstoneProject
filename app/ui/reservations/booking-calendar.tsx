"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/app/store/store";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

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

import { reservations } from "@/app/lib/placeholder-data";

const formSchema = z.object({
  guestAdult: z
    .number({
      message: "Guest is required!",
    })
    .min(1, { message: "You haven't set your adult count yet." })
    .max(12),
  guestChildren: z.number().optional(),
  date: z
    .object(
      {
        from: z.date({ message: "Your check-in date is missing." }).optional(),
        to: z.date({ message: "Check out date is required!" }).optional(),
      },
      { message: "Check-in and check-out is required!" }
    )
    .refine((data) => data.from, {
      message: "Check-in and check-out is required!",
    })
    .refine((data) => data.to, {
      message: "Check-out date is required!",
    }),
});

export default function BookingCalendar() {
  const router = useRouter();
  const {
    setAdultNumberGuest,
    setChildrenNumberGuest,
    setCheckInDate,
    setCheckOutDate,
  } = useStore();
  const [adultCount, setAdultCount] = useState<number>(0);
  const [childCount, setChildCount] = useState<number>(0);
  const [nightCount, setNightCount] = useState(0);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [submitDisable, setSubmitDisable] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestChildren: 0,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setSubmitDisable(true);
      setAdultNumberGuest(data.guestAdult);
      setChildrenNumberGuest(data.guestChildren ?? 0);

      if (data.date.from) {
        setCheckInDate(data.date.from.toISOString());
      }
      if (data.date.to) {
        setCheckOutDate(data.date.to.toISOString());
      }

      router.push("/booking");
    } catch (error) {
      console.error("Reservation submission failed: ", error);
    }
  }

  // ```
  // Set the week days name to three letters than two letters default
  // ```
  const formatWeekdayName = (date: Date) => {
    return format(date, "EEE"); // Shortened weekday name
  };

  // ```
  // Handles adult count by adding and subtracting the number of adult guest count
  // ```
  const adultCountHandler = (count: number) => {
    setAdultCount(Math.max(1, Math.min(12, adultCount + count)));
  };

  // ```
  // Handles children count by adding and subtracting the number of children guest count
  // ```
  const childCountHandler = (count: number) => {
    setChildCount(Math.max(0, Math.min(12, childCount + count)));
  };

  // ```
  // Disables the existing reservation dates
  // ```
  const isDisabledDate = () => {
    const dates = reservations.flatMap((reservation) => {
      const { checkIn, checkOut } = reservation;
      let currentDate = new Date(checkIn);
      const disabledDatesArray = [];

      // Collect all dates between check-in and check-out
      while (currentDate <= checkOut) {
        const disabledDate = new Date(currentDate);
        disabledDate.setHours(0, 0, 0, 0); // Set time to midnight
        disabledDatesArray.push(disabledDate);
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }

      return disabledDatesArray;
    });

    setDisabledDates(dates);
  };

  // ```
  // Side effect the disable dates
  // ```
  useEffect(() => {
    isDisabledDate();
  }, []);

  useEffect(() => {
    if (date) {
      if (date.from)
        if (date.from && date.to) {
          const from = new Date(date.from);
          const to = new Date(date.to);

          if (from && to) {
            const differenceMs = to.getTime() - from.getTime();
            const daysDifference = Math.ceil(
              differenceMs / (1000 * 60 * 60 * 24)
            );
            setNightCount(daysDifference);
          }
        }
    } else {
      setNightCount(0);
    }
  }, [date, nightCount]);

  // Check if the fields are filled to undisabled the button
  useEffect(() => {
    // Check if all fields are filled
    if (date) {
      if (date.from && date.to && adultCount > 0) {
        setIsDisabled(false); // Enable button
      } else {
        setIsDisabled(true); // Disable button
      }
    }
  }, [date, adultCount]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-4 md:mx-28 space-y-5"
      >
        <div className="border-y grid grid-cols-1 lg:grid-cols-3 lg:items-center gap-y-5 md:gap-y-10 px-3 md:py-12">
          <section className="space-y-3 lg:col-span-1 mt-5 md:mt-0">
            <div className="space-y-8 md:px-3 py-8">
              <FormField
                control={form.control}
                name="guestAdult"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="font-light uppercase tracking-widest ">
                      <p>Adults</p>
                      <p className="text-xs capitalize text-gray-400 tracking-normal">
                        Age 13+
                      </p>
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-around items-center">
                        <CountButton
                          className="h-10 w-10 p-2.5"
                          variant={"outline"}
                          size={"count"}
                          control="decrement"
                          onClick={() => {
                            adultCountHandler(-1);
                            field.onChange(adultCount - 1);
                          }}
                          disabled={adultCount === 1}
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
                            adultCountHandler(1);
                            field.onChange(adultCount + 1);
                          }}
                          disabled={adultCount === 12}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guestChildren"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="font-light uppercase tracking-widest ">
                      <p>Children</p>
                      <p className="text-xs capitalize text-gray-400 tracking-normal">
                        Ages 2-12
                      </p>
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-around items-center">
                        <CountButton
                          className="h-10 w-10 p-2.5"
                          variant={"outline"}
                          size={"count"}
                          control="decrement"
                          onClick={() => {
                            childCountHandler(-1);
                            field.onChange(childCount - 1);
                          }}
                          disabled={childCount === 0}
                        />

                        <p className="font-medium text-lg cursor-default">
                          {childCount}
                        </p>

                        <CountButton
                          className="h-10 w-10 p-2.5 duration-200"
                          variant={"outline"}
                          size={"count"}
                          control="increment"
                          onClick={() => {
                            childCountHandler(1);
                            field.onChange(childCount + 1);
                          }}
                          disabled={childCount === 12}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AnimatePresence>
              {date && date.to && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:block text-sm space-y-8 p-8 md:py-8 md:px-14"
                >
                  <div className="flex justify-between">
                    <p>
                      ₱4,000 x{" "}
                      <span>
                        {nightCount > 1
                          ? `${nightCount} nights`
                          : `${nightCount} night`}
                      </span>
                    </p>{" "}
                    <p>
                      ₱
                      {(4000 * nightCount).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>

                  <div className="font-semibold flex justify-between border-t pt-6 pb-2">
                    <p>Total</p>
                    <p>
                      ₱
                      {(4000 * nightCount).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="justify-center hidden md:flex">
              <Button
                className="rounded-md w-3/4 mx-auto"
                variant={"outline"}
                type="submit"
                disabled={isDisabled || submitDisable}
              >
                Reserve
              </Button>
            </div>
          </section>

          <section className="space-y-3 lg:col-span-2 pb-10 md:pb-0">
            <div className="space-y-4 md:px-3 pt-5 md:pt-0 md:pb-0 pb-2">
              <h4 className="text-sm text-center font-light uppercase tracking-widest">
                Select you stay
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
                        numberOfMonths={isDesktop ? 2 : 1}
                        selected={{
                          from: field.value?.from ?? undefined,
                          to: field.value?.to ?? undefined,
                        }}
                        onSelect={(value) => {
                          if (value?.from && value?.to) {
                            if (value.from.getTime() === value.to.getTime()) {
                              // Set `to` as undefined to clear the range
                              field.onChange({
                                from: value.from,
                                to: undefined,
                              });
                              setDate({ from: value.from, to: undefined });
                            } else {
                              // If from and to are valid, proceed as usual
                              field.onChange({
                                from: value.from,
                                to: value.to,
                              });
                              setDate(value);
                            }
                          } else if (value?.from && !value?.to) {
                            // Handle regular selection (only `from` is selected)
                            field.onChange({
                              from: value.from,
                              to: undefined, // Keep `to` undefined for a single date selection
                            });
                            setDate({
                              from: value.from,
                              to: undefined,
                            });
                          } else {
                            // Clear selection if no date is selected
                            field.onChange(undefined);
                            setDate(undefined);
                          }
                        }}
                        max={14}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0); // Ensure we are comparing only the date part

                          // Disable past dates
                          if (date <= today) {
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
                          formatWeekdayName,
                        }}
                        excludeDisabled
                      />
                    </FormControl>

                    {date?.from &&
                      (date.to ? (
                        <p className="text-sm font-light uppercase tracking-wide pb-5 md:pb-0">
                          {format(date.from, "PPP")} - {format(date.to, "PPP")}
                        </p>
                      ) : (
                        <p className="text-sm font-light uppercase tracking-wide pb-5 md:pb-0">
                          {format(date.from, "PPP")}
                        </p>
                      ))}

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AnimatePresence>
              {date && date.to && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="block md:hidden text-sm space-y-8 p-8"
                >
                  <div className="flex justify-between">
                    <p>
                      ₱4,000 x{" "}
                      <span>
                        {nightCount > 1
                          ? `${nightCount} nights`
                          : `${nightCount} night`}
                      </span>
                    </p>{" "}
                    <p>
                      ₱
                      {(4000 * nightCount).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>

                  <div className="font-semibold flex justify-between border-t pt-6 pb-2">
                    <p>Total</p>
                    <p>
                      ₱
                      {(4000 * nightCount).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="justify-center flex md:hidden">
              <Button
                className="rounded-md w-full mx-auto"
                variant={"outline"}
                type="submit"
                disabled={isDisabled || submitDisable}
              >
                Reserve
              </Button>
            </div>
          </section>
        </div>
      </form>
    </Form>
  );
}
