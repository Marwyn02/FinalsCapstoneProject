"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SpecialPriceCreate } from "@/features/specialDate/api/SpecialPriceCreate";
import { SpecialPrice } from "@/app/lib/types/types";

const formSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), { message: "Invalid number" }),
});

const SpecialPriceForm = ({
  specialPrice,
}: {
  specialPrice: SpecialPrice[];
}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [disabledDate, setDisabledDate] = useState<Date[]>([]);
  const [message, setMessage] = useState("Create Special Date");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmit(true);
    setMessage("Creating...");

    const uuid = uuidv4().toUpperCase();

    if (values.date && values.price) {
      const data = {
        id: uuid,
        date: values.date,
        price: Number(values.price),
      };
      setIsSubmit(false);

      if (data) {
        const response = await SpecialPriceCreate(data);

        setIsSubmit(false);

        if (response && !response.success) {
          setMessage("Special Date already exist!");
        } else {
          setMessage("Special Date Created!");
          setTimeout(() => {
            setMessage("Create Special Date");
          }, 3000);
        }
      }
    }
  };

  // Side effect the disable dates
  useEffect(() => {
    const fetchSpecialDates = async () => {
      try {
        // Map over the specialPrice array to extract the `date` field
        const disabledDatesArray = specialPrice.map(
          (item) => new Date(item.date)
        );

        setDisabledDate(disabledDatesArray);
      } catch (error) {
        console.error("Error processing special price dates: ", error);
      }
    };

    fetchSpecialDates();
  }, [specialPrice]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="col-span-1 space-y-5 bg-white"
      >
        <h1 className="text-2xl font-medium font-teko border-b border-gray-500 px-10 py-5">
          Create your special date
        </h1>

        <section className="space-y-5 bg-white px-10 pb-10 pt-5">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Special price date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[350px] px-5 pb-5 pt-8"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        if (date < new Date()) {
                          return true;
                        }

                        if (date < new Date("1900-01-01")) {
                          return true;
                        }

                        const isSameDay = (date1: Date, date2: Date) => {
                          return (
                            date1.getFullYear() === date2.getFullYear() &&
                            date1.getMonth() === date2.getMonth() &&
                            date1.getDate() === date2.getDate()
                          );
                        };

                        if (
                          disabledDate.some((dates) => isSameDay(date, dates))
                        ) {
                          return true;
                        }
                        return false;
                      }}
                      className="p-0"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-0 sm:space-y-0",
                        month: "space-y-4 w-full",
                        month_caption:
                          "flex justify-center mb-2 relative items-center",
                        caption_label: "text-base font-medium",
                        nav: "space-x-1 md:absolute md:w-full flex justify-between items-center translate-y-10 mx-5 md:mx-0 md:translate-y-0 z-50",
                        button_previous:
                          "md:absolute md:top-0 md:left-6 text-gray-800 hover:text-gray-500 duration-300",

                        button_next:
                          "md:absolute md:top-0 md:right-16 text-gray-800 hover:text-gray-500 duration-300",
                        month_grid:
                          "grid justify-center w-full border-collapse",
                        weekdays: "flex mb-3",
                        weekday:
                          "text-slate-800 w-full rounded-md font-light text-[0.8rem] dark:text-slate-400",
                        week: "flex w-full mt-2",
                        day: cn(
                          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md"
                        ),
                        day_button: cn(
                          "h-10 w-10 p-0 font-normal aria-selected:opacity-100"
                        ),
                        range_start: "day-range-start",
                        range_end: "day-range-end",
                        selected:
                          "bg-stone-800 text-white focus:bg-slate-800 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900 duration-300",
                        today: "bg-slate-300 text-yellow-700",
                        outside:
                          "day-outside rounded-2xl text-slate-500 opacity-50 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 aria-selected:opacity-30 dark:text-slate-400 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-400",
                        disabled: "day-disabled text-slate-500 opacity-20",
                        range_middle:
                          "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        hidden: "invisible",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This field allows you to set a price for a specify the date.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl className="text-start">
                  <Input {...field} type="number" placeholder="0.0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmit}>
            {message}
          </Button>
        </section>
      </form>
    </Form>
  );
};

export default SpecialPriceForm;
