"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Calendar } from "@/components/ui/calendar";
import { ChevronRight } from "lucide-react";

import { computeNights } from "@/app/lib/helpers";
import { Reservation } from "@/app/lib/types/types";

export function UpcomingSchedule({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentDate = useMemo(() => {
    const date = new Date();
    date.setHours(12, 0, 0, 0); // Normalize time to noon
    return date;
  }, []);

  const [upcomingReservations, setUpcomingReservations] = useState<
    Reservation[]
  >([]);

  // Filtering and sorting the upcoming reservations from the reservation database
  useEffect(() => {
    if (reservations.length > 0) {
      const filteredUpcomingReservation = reservations
        .filter((reservation: Reservation) => {
          return reservation.checkIn.getTime() > currentDate.getTime();
        })
        .map((reservation: Reservation) => {
          const nights = computeNights(
            new Date(reservation.checkIn),
            new Date(reservation.checkOut)
          );

          return {
            ...reservation,
            nights, // Add the computed nights to the reservation object
          };
        })
        .sort(
          (a: Reservation, b: Reservation) =>
            a.checkIn.getTime() - b.checkIn.getTime()
        );

      setUpcomingReservations(filteredUpcomingReservation);
    }
  }, [reservations, currentDate]);
  return (
    <section className="grid grid-cols-5 gap-2.5">
      <div className="col-span-3 pt-8 pb-6 w-full bg-white border border-gray-500 rounded-lg">
        <AdminCalendar reservations={reservations} />
      </div>

      {/* Upcoming Reservations */}
      <div className="col-span-2 h-[310px] w-full bg-white rounded-lg border border-gray-500 p-6 space-y-5">
        <p className="font-semibold">Upcoming Reservations</p>

        <div className="grid gap-y-4">
          {upcomingReservations.slice(0, 3).map((r: Reservation) => (
            <div key={r.id} className="grid grid-cols-10 items-center gap-x-1">
              <div className="flex items-center gap-x-3 col-span-5 py-1">
                <div>
                  <p className="text-xs text-gray-400">
                    {days[r.checkIn.getDay()]}, {r.checkIn.getFullYear()}
                  </p>
                  <p className="font-semibold text-[15px]">
                    {r.checkIn.getDate()}{" "}
                    {r.checkIn.toLocaleString("default", { month: "long" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">
                    {days[r.checkOut.getDay()]}, {r.checkOut.getFullYear()}
                  </p>
                  <p className="font-semibold text-[15px]">
                    {r.checkOut.getDate()}{" "}
                    {r.checkOut.toLocaleString("default", { month: "long" })}
                  </p>
                </div>
              </div>

              <Link
                href={"/admin-dashboard"}
                className="col-span-5 flex justify-between items-center px-4 py-3 rounded-md bg-gray-50 w-full"
              >
                <div>
                  <p className="font-semibold">
                    {r.nights} {r.nights && r.nights > 1 ? "nights" : "night"}{" "}
                    stay
                  </p>
                  <p className="text-xs text-gray-400">
                    By{" "}
                    <span className="text-black font-medium">
                      {r.firstName + " " + r.lastName}
                    </span>
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-yellow-600" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdminCalendar({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  // ```
  // Assign a different price for some dates
  // ```
  const specificDatePrices: { [key: string]: number } = {
    "2024-09-23": 10500,
    "2024-10-15": 5000,
  };

  // ```
  // Setting prices for the dates
  // ```
  const getStaticPriceForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];

    // Check if the date has a specific price
    if (specificDatePrices[dateString]) {
      return specificDatePrices[dateString];
    }

    let dayOfWeek = date.getDay();

    if (dayOfWeek === 6 || dayOfWeek === 5) {
      return 4000; // Fixed price for weekends
    }

    // Weekday Pricing (Monday to Friday)
    return 3000; // Fixed price for weekdays
  };

  // ```
  // Set prices for the month
  // ```
  const getPricesForMonth = () => {
    const prices: { [key: string]: number } = {};
    const currentDate = new Date();
    currentDate.setDate(0);

    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 3);
    endDate.setDate(1);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      prices[dateString] = getStaticPriceForDate(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return prices;
  };

  const prices = getPricesForMonth();

  // ```
  //   Formatter for the days in calendar
  //   ```
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

    const price = prices[dateString]
      ? `₱${prices[dateString].toLocaleString("en-US")}`
      : ""; // Display blank for the last selected date

    return (
      <div className="day-cell">
        <span>{date.getDate()}</span>
        {price && <div className="price text-[9px] text-gray-500">{price}</div>}
      </div>
    );
  };

  // ```
  // Side effect the disable dates
  // ```
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const disabledDatesArray = reservations.flatMap(
          ({ checkIn, checkOut }) => {
            const dates = [];
            let currentDate = new Date(checkIn);

            // Get the dates from and between and last on the checking
            while (currentDate <= checkOut) {
              dates.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }

            return dates;
          }
        );

        setDisabledDates(disabledDatesArray);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations();
  }, [reservations]);
  return (
    <Calendar
      classNames={{
        months:
          "relative grid grid-cols-1 lg:grid-cols-2 justify-start gap-x-2 sm:flex-row",
        button_previous:
          "md:absolute md:top-0 md:left-5 text-gray-800 hover:text-gray-500 duration-300",
        day: "relative rounded-md p-0 text-center text-sm",
        selected:
          "bg-transparent text-slate-800 hover:bg-transparent hover:text-slate-800",
      }}
      mode="single"
      numberOfMonths={2}
      disabled={(date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ensure we are comparing only the date part

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
          disabledDates.some((disabledDate) => isSameDay(date, disabledDate))
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
    />
  );
}

export function AdminAnalytics({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const currentDate = useMemo(() => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    return date;
  }, []);

  // Filter the reservations to get the ones that are currently active
  const currentStayReservations = useMemo(() => {
    return reservations.filter((reservation: Reservation) => {
      const checkInDate = new Date(reservation.checkIn);
      const checkOutDate = new Date(reservation.checkOut);

      checkInDate.setHours(12, 0, 0, 0);
      checkOutDate.setHours(12, 0, 0, 0);

      return (
        reservation.checkIn <= currentDate &&
        reservation.checkOut >= currentDate
      );
    });
  }, [currentDate, reservations]);

  // Filter the finished reservations
  const finishedReservations = useMemo(() => {
    return reservations.filter((reservation: Reservation) => {
      const checkOutDate = new Date(reservation.checkOut);
      checkOutDate.setHours(12, 0, 0, 0);

      return checkOutDate < currentDate;
    });
  }, [currentDate, reservations]);

  // Calculate total profit from finished reservations
  const totalProfit = useMemo(() => {
    return finishedReservations.reduce(
      (sum: number, reservation: Reservation) => {
        return sum + parseFloat(reservation.payment);
      },
      0
    );
  }, [finishedReservations]);
  return (
    <section className="grid grid-cols-4 gap-3">
      {/* Total Profit */}
      <Link
        href={"/admin-dashboard"}
        className="h-[150px] w-full rounded-md border bg-white border-gray-500 p-5 space-y-6"
      >
        <div className="flex justify-between items-center">
          <p className="font-medium">Profit Total</p>
          <ChevronRight className="h-4 w-4 text-yellow-700" />
        </div>

        <div>
          <p className="font-semibold text-3xl">₱{totalProfit}</p>
          <p className="text-gray-400 text-sm">
            vs last month:{" "}
            <span className="text-black font-semibold">₱{totalProfit}</span>
          </p>
        </div>
      </Link>

      {/* Total Booking */}
      <Link
        href={"/admin-dashboard/reservations"}
        className="h-[150px] w-full rounded-md border bg-white border-gray-500 p-5 space-y-6"
      >
        <div className="flex justify-between items-center">
          <p className="font-medium">Total Upcoming Bookings</p>
          <ChevronRight className="h-4 w-4 text-yellow-700" />
        </div>

        <div>
          <p className="font-semibold text-3xl">{reservations.length}</p>
          <p className="text-gray-400 text-sm">
            vs last month:{" "}
            <span className="text-black font-semibold">
              {reservations.length}
            </span>
          </p>
        </div>
      </Link>

      {/* Currently in stay */}
      <Link
        href={"/admin-dashboard/reservations"}
        className={`col-span-2 h-[150px] w-full rounded-md border border-gray-500 p-5 ${
          currentStayReservations.length > 0
            ? "space-y-8 bg-white"
            : "opacity-75 bg-gray-200 space-y-14"
        }`}
      >
        <div className="flex justify-between items-center">
          <p className="font-medium">Currently in Stay</p>
          <ChevronRight className="h-4 w-4 text-yellow-700" />
        </div>

        {currentStayReservations.length > 0 ? (
          <div>
            {currentStayReservations.map((r) => (
              <div key={r.id}>
                <p className="font-semibold text-xl">
                  {r.checkIn.toDateString()} - {r.checkOut.toDateString()}
                </p>
                <p className="text-gray-400 text-sm">
                  By{" "}
                  <span className="text-black font-medium">
                    {r.firstName + " " + r.lastName}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="font-medium text-base">No current stays.</p>
          </div>
        )}
      </Link>
    </section>
  );
}
