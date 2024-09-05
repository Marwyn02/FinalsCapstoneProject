"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months:
          "relative grid grid-cols-1 justify-center -mt-5 sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        month_caption: "flex justify-center mb-2 relative items-center",
        caption_label: "text-sm font-light uppercase tracking-wider",
        nav: "space-x-1 flex justify-between items-center mx-5 translate-y-9 z-50",
        button_previous: "hover:text-gray-400 duration-300",
        button_next: "hover:text-gray-400 duration-300",
        month_grid: "grid justify-center w-full md:w-full border-collapse",
        weekdays: "flex mb-3",
        weekday:
          "text-slate-800 w-12 font-light text-[0.8rem] dark:text-slate-400",
        week: "flex w-full",
        day: cn(
          "relative hover:bg-gray-200 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn("h-12 w-12 p-0 font-normal"),
        range_start: "range_start",
        range_end: "range_end",
        selected:
          "bg-slate-900 text-slate-50 hover:bg-slate-300 hover:text-slate-900 focus:bg-slate-900 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900 duration-300",
        today: "bg-slate-300 text-yellow-700",
        outside:
          "day-outside rounded-2xl text-slate-500 opacity-50 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 aria-selected:opacity-30 dark:text-slate-400 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-400",
        disabled: "day-disabled text-slate-500 opacity-20",
        range_middle:
          "aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeft {...props} />;
          }
          return <ChevronRight {...props} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

// day: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].range_end)]:rounded-r-full [&:has([aria-selected].outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-slate-800/50 dark:[&:has([aria-selected])]:bg-slate-800",
// "rounded-0 bg-slate-900 text-slate-50 hover:bg-red-900 hover:text-white focus:bg-slate-900 focus:text-slate-50",
// "rounded-2xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
// " rounded-2xl outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
// "text-slate-500 opacity-50 dark:text-slate-400",
// "aria-selected:bg-slate-100 aria-selected:text-slate-900",