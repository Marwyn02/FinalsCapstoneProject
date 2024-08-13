"use client";

import { useState } from "react";
import { format } from "date-fns";

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

import RoomSelection from "./room-selection";

const formSchema = z.object({
  guestAdult: z
    .number()
    .min(1, { message: "You haven't set your adult count yet." })
    .max(12),
  guestChildren: z.number().optional(),
  room: z
    .string({
      message: "Please select a room.",
    })
    .refine((value) => value !== "", {
      message: "Please select a room.",
    }),
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
  const [adultCount, setAdultCount] = useState<number>(0);
  const [childCount, setChildCount] = useState<number>(0);
  const [roomSelect, setRoomSelect] = useState(false);
  const [submitDisable, setSubmitDisable] = useState<boolean>(false);

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
      console.log("====================================");
      console.log({
        title: "You submitted the following values:",
        description: data,
      });
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

  console.log(date);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mb-5">
        <div className="grid md:grid-cols-2 gap-y-10">
          <section className="space-y-3">
            <h3 className="text-xl font-medium text-gray-500">
              <span className="text-black font-semibold">Select</span> number of
              guests for your stay.
            </h3>

            <div className="border border-gray-300 rounded-3xl space-y-8 px-3 py-8">
              <FormField
                control={form.control}
                name="guestAdult"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="font-light uppercase text-center tracking-widest">
                      Adults
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-around items-center">
                        <CountButton
                          className="h-12 w-12 p-2.5"
                          variant={"outline"}
                          size={"count"}
                          control="decrement"
                          onClick={() => {
                            adultCountHandler(-1);
                            field.onChange(adultCount - 1);
                          }}
                          disabled={adultCount === 1}
                        />

                        <p className="font-bold text-lg cursor-default">
                          {adultCount}
                        </p>

                        <CountButton
                          className="h-12 w-12 p-2.5 active:bg-gray-700 duration-200"
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
                    <FormLabel className="font-light uppercase tracking-widest">
                      Children
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-around items-center">
                        <CountButton
                          className="h-12 w-12 p-2.5"
                          variant={"outline"}
                          size={"count"}
                          control="decrement"
                          onClick={() => {
                            childCountHandler(-1);
                            field.onChange(childCount - 1);
                          }}
                          disabled={childCount === 0}
                        />

                        <p className="font-bold text-lg cursor-default">
                          {childCount}
                        </p>

                        <CountButton
                          className="h-12 w-12 p-2.5 active:bg-gray-700 duration-200"
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
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-medium text-gray-500">
              <span className="text-black font-semibold">Plan</span> your
              check-in and check-out.
            </h3>
            <div className="border border-gray-300 rounded-3xl space-y-8 px-3 pt-8 pb-2">
              <h4 className="text-center font-light uppercase tracking-widest">
                Select you stay
              </h4>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="block text-sm font-light uppercase tracking-widest">
                      Check in - Check out
                    </FormLabel>

                    <FormControl>
                      <Calendar
                        mode="range"
                        selected={{
                          from: field.value?.from ?? undefined,
                          to: field.value?.to ?? undefined,
                        }}
                        onSelect={(value) => {
                          if (value?.from && value?.to) {
                            const nextDay = new Date(value.from);
                            nextDay.setDate(nextDay.getDate() + 1);

                            if (value.to.getTime() === value.from.getTime()) {
                              // Automatically set to the next day if the same day is selected
                              value.to = nextDay;
                            }

                            field.onChange({ from: value.from, to: value.to });
                            setDate(value);
                          } else {
                            field.onChange(value);
                            setDate(value);
                          }
                        }}
                        max={14}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0); // Ensure we are comparing only the date part

                          // Disable past dates
                          if (date < today) {
                            return true;
                          }

                          // Disable dates less than or equal to the selected "from" date
                          if (
                            field.value?.from &&
                            (date < field.value.from ||
                              date === field.value.from)
                          ) {
                            return true;
                          }

                          return false; // All other dates are enabled
                        }}
                        formatters={{
                          formatWeekdayName,
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <RoomSelection
            date={date}
            onRoomSelect={(selected: boolean) => setRoomSelect(selected)}
          />

          <Button type="submit" disabled={roomSelect && submitDisable}>
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
