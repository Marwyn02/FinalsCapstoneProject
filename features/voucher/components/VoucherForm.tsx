"use client";

import React, { useState } from "react";
import { Admin } from "@/app/lib/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { VoucherCreate } from "@/features/voucher/api/VoucherCreate";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Code must be at least 6 characters.",
    })
    .max(12, { message: "Voucher code must be not more than 10 characters." })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message:
        "Voucher code can only contain letters, spaces, hyphens, and apostrophes.",
    }),
  discountAmount: z.string(),
  discountPercent: z.string(),
  expiryDate: z.date({
    required_error: "An expiry date is required.",
  }),
});

const VoucherForm = ({ admin }: { admin: Admin }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [message, setMessage] = useState("Create Voucher");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discountAmount: "",
      discountPercent: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmit(true);
    setMessage("Creating your voucher...");

    if (values.code) {
      const trimmedCode = values.code.replace(/\s+/g, "");

      const data = {
        code: trimmedCode,
        discountAmount: Number(values.discountAmount),
        discountPercent: Number(values.discountPercent),
        expiryDate: values.expiryDate,
        adminId: admin.adminId,
        isActive: true,
      };

      if (data) {
        const response = await VoucherCreate(data);

        if (response && !response.success) {
          setMessage(response.message);
          setIsSubmit(response.success);
          setTimeout(() => {
            setMessage("Submit");
          }, 3000);
        } else {
          setMessage("Voucher Created!");
        }
      }
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="col-span-1 space-y-5 bg-white h-screen"
      >
        <h1 className="text-2xl font-medium font-teko border-b border-gray-500 px-10 py-5">
          Create your voucher
        </h1>

        <section className="space-y-5 bg-white px-10 pb-10 pt-5">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voucher Code</FormLabel>
                <FormControl>
                  <Input {...field} max={10} min={6} disabled={isSubmit} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-x-4 pb-5">
            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Amount</FormLabel>
                  <FormControl className="text-start">
                    <Input
                      {...field}
                      placeholder="0.0"
                      type="number"
                      disabled={isSubmit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Discount Percent{" "}
                    <span className="text-gray-400 italic">(optional)</span>
                  </FormLabel>
                  <FormControl className="text-start">
                    <Input
                      {...field}
                      placeholder="0%"
                      type="number"
                      disabled={isSubmit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Voucher expiry until</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isSubmit}
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
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
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
                  This field allows you to specify the date on which a voucher
                  or coupon will expire. Once this date is reached, the voucher
                  will no longer be valid for use.
                </FormDescription>
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

export default VoucherForm;
