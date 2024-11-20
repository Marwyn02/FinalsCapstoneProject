"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Reservation } from "@/app/lib/types/types";
import { computeNights } from "@/app/utils/ReservationHelpers";
import { RequestEmailFeedback } from "../utils/RequestEmailFeedback";

import { ChevronRight, KeyRound, Moon, Ellipsis } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { ReservationDelete } from "@/features/reservation/api/ReservationDelete";
import { ReservationPaid } from "@/features/reservation/api/ReservationPaid";
import { ReservationSetUpdate } from "@/features/reservation/api/ReservationSetUpdating";

const ReservationList = ({ reservations }: { reservations: Reservation[] }) => {
  const currentDate = useMemo(() => {
    const date = new Date();
    date.setHours(12, 0, 0, 0); // Normalize time to noon
    return date;
  }, []);

  const [upcomingReservations, setUpcomingReservations] = useState<
    Reservation[] | null
  >([]);
  const [singleReservation, setSingleReservation] =
    useState<Reservation | null>(null);
  const [completeReservations, setCompleteReservations] = useState<
    Reservation[] | null
  >([]);
  const [canceledReservations, setCanceledReservations] = useState<
    Reservation[] | null
  >([]);
  const [paidReservations, setPaidReservations] = useState<
    Reservation[] | null
  >([]);
  const [updatingReservations, setUpdatingReservations] = useState<
    Reservation[] | null
  >([]);
  const [currentReservation, setCurrentReservation] = useState<
    Reservation[] | null
  >([]);

  useEffect(() => {
    const fetchReservations = async () => {
      // Upcoming reservations
      const filteredUpcomingReservations = reservations
        .filter(
          (reservation: Reservation) =>
            reservation.status === "confirmed" &&
            reservation.checkIn.getTime() > currentDate.getTime()
        )
        .map((reservation: Reservation) => ({
          ...reservation,
          nights: computeNights(
            new Date(reservation.checkIn),
            new Date(reservation.checkOut)
          ),
        }))
        .sort((a, b) => a.checkIn.getTime() - b.checkIn.getTime());

      // Canceled Reservations
      const filteredCanceledReservations = reservations
        .filter((reservation: Reservation) => reservation.status === "canceled")
        .map((reservation: Reservation) => ({
          ...reservation,
          nights: computeNights(
            new Date(reservation.checkIn),
            new Date(reservation.checkOut)
          ),
        }))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() // Sort by cancellation or update date, most recent first
        );

      // Complete Reservations
      const filteredCompleteReservations = reservations
        .filter(
          (reservation: Reservation) =>
            reservation.checkOut < currentDate &&
            reservation.status === "complete"
        )
        .sort(
          (a, b) =>
            new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime()
        );

      // Paid Reservations
      const filteredPaidReservations = reservations
        .filter(
          (reservation: Reservation) =>
            reservation.checkOut < currentDate && reservation.status === "paid"
        )
        .sort(
          (a, b) =>
            new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime()
        );

      // Paid Reservations
      const filteredUpdatingReservations = reservations
        .filter(
          (reservation: Reservation) =>
            reservation.checkIn.getTime() > currentDate.getTime() &&
            reservation.status === "updating"
        )
        .map((reservation: Reservation) => ({
          ...reservation,
          nights: computeNights(
            new Date(reservation.checkIn),
            new Date(reservation.checkOut)
          ),
        }))
        .sort(
          (a, b) =>
            new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime()
        );

      const filteredCurrentReservations = reservations
        .filter(
          (reservation: Reservation) =>
            reservation.checkIn.getTime() <= currentDate.getTime() &&
            reservation.checkOut.getTime() > currentDate.getTime() // Still checked-in
        )
        .map((reservation: Reservation) => ({
          ...reservation,
          nights: computeNights(
            new Date(reservation.checkIn),
            new Date(reservation.checkOut)
          ),
        }));

      setCompleteReservations(filteredCompleteReservations);
      setCanceledReservations(filteredCanceledReservations);
      setUpcomingReservations(filteredUpcomingReservations);
      setPaidReservations(filteredPaidReservations);
      setUpdatingReservations(filteredUpdatingReservations);
      setCurrentReservation(filteredCurrentReservations);
    };

    fetchReservations();
  }, [currentDate, reservations]);
  return (
    <section className="h-screen overflow-y-scroll col-span-3 bg-[#fcf4e9] px-8 py-12">
      <h1 className="text-3xl font-medium font-teko">Reservations List</h1>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="updating">Updating</TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="grid gap-2">
          {upcomingReservations && upcomingReservations.length > 0 ? (
            upcomingReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <p>No upcoming reservations.</p>
          )}
        </TabsContent>

        <TabsContent value="complete" className="grid gap-2">
          {completeReservations && completeReservations.length > 0 ? (
            completeReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <p>No complete reservations.</p>
          )}
        </TabsContent>

        <TabsContent value="canceled" className="grid gap-2">
          {canceledReservations && canceledReservations.length > 0 ? (
            canceledReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <p>No canceled reservations.</p>
          )}
        </TabsContent>

        <TabsContent value="paid" className="grid gap-2">
          {paidReservations && paidReservations.length > 0 ? (
            paidReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <p>No paid reservations.</p>
          )}
        </TabsContent>

        <TabsContent value="updating" className="grid gap-2">
          {updatingReservations && updatingReservations.length > 0 ? (
            updatingReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <p>No updating reservations.</p>
          )}
        </TabsContent>

        <TabsContent value="current" className="grid gap-2">
          {currentReservation && currentReservation.length > 0 ? (
            currentReservation.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <p>No current reservations.</p>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export const ReservationCard = ({
  reservation,
}: {
  reservation: Reservation;
}) => {
  const router = useRouter();
  const currentDate = new Date();
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Request Guest Feedback"
  );
  const [settingPaidMessage, setSettingPaidMessage] =
    useState("Set Fully Paid");

  const handleReservationDeletion = async (reservationId: string) => {
    try {
      if (reservationId !== "" && reservationId !== undefined) {
        await ReservationDelete(reservationId);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleRequestEmailFeedback = async (
    reservationId: string,
    firstName: string,
    lastName: string,
    checkIn: Date,
    checkOut: Date,
    email: string
  ) => {
    const values = {
      reservationId,
      name: `${firstName + " " + lastName}`,
      checkIn,
      checkOut,
      email,
    };

    try {
      setFeedbackMessage("Sending");

      if (values) {
        const response = await RequestEmailFeedback(values);

        if (response) {
          setFeedbackMessage(response.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReservationPaid = async (
    reservationId: string,
    status: string
  ) => {
    setSettingPaidMessage("Updating Payment");

    const response = await ReservationPaid(reservationId, status);

    if (response) {
      setSettingPaidMessage("Reservation Fully Paid");
    } else {
      setSettingPaidMessage("Updating Failed");
    }
  };

  // Handle setting the reservation status to updating
  const handleSetUpdateReservation = async (reservationId: string) => {
    if (reservationId !== "") {
      await ReservationSetUpdate(reservationId);
      router.push(`/admin-dashboard/reservations/update/${reservationId}`);
    }
  };
  return (
    <div
      className={`${
        reservation.status !== "canceled"
          ? "flex divide-x-[1px] divide-gray-300 w-full border border-gray-200 bg-white rounded-lg px-6 py-4 group hover:bg-gray-100 duration-300"
          : "flex divide-x-[1px] divide-gray-300 w-full border border-gray-200 bg-white rounded-lg px-6 py-4 opacity-50"
      }`}
    >
      <div className="flex items-center gap-x-4 pr-10">
        <div className="flex flex-col -space-y-1 text-center">
          <p className="mb-1">
            {reservation.checkIn.toLocaleString("default", {
              weekday: "short",
            })}
          </p>
          <p className="font-semibold text-3xl">
            {reservation.checkIn.getDate()}
          </p>
          <p className="font-medium text-sm">
            {" "}
            {reservation.checkIn.toLocaleString("default", {
              month: "long",
            })}
          </p>
        </div>

        <ChevronRight />

        <div className="flex flex-col -space-y-1 text-center">
          <p className="mb-1">
            {reservation.checkOut.toLocaleString("default", {
              weekday: "short",
            })}
          </p>
          <p className="font-semibold text-3xl">
            {reservation.checkOut.getDate()}
          </p>
          <p className="font-medium text-sm">
            {" "}
            {reservation.checkOut.toLocaleString("default", {
              month: "long",
            })}
          </p>
        </div>
      </div>

      <section className="grid grid-cols-7 w-full pl-10 text-gray-700">
        <div className="col-span-6 grid grid-cols-3 items-center">
          <div className="flex flex-col items-start gap-y-3">
            <div className="flex items-center gap-x-1">
              <KeyRound className="h-4 w-4" />{" "}
              <p>{reservation.reservationId}</p>
            </div>

            <div className="flex items-center gap-x-1 text-gray-500">
              <Moon className="h-4 w-4" />
              <p>
                {" "}
                {reservation.nights}{" "}
                {reservation.nights && reservation.nights > 1
                  ? "nights"
                  : "night"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-y-3">
            <p className="font-semibold">
              {" "}
              {reservation.prefix +
                " " +
                reservation.firstName +
                " " +
                reservation.lastName}
            </p>

            <div className="flex items-center gap-x-5 text-gray-500">
              <p>
                {reservation.adult}{" "}
                {reservation.adult && Number(reservation.adult) > 1
                  ? "Adults"
                  : "Adult"}
              </p>

              {reservation.children !== "0" && (
                <p>
                  {reservation.children}{" "}
                  {reservation.children && Number(reservation.children) > 1
                    ? "Children"
                    : "Child"}
                </p>
              )}
            </div>
          </div>

          {reservation.status === "confirmed" ? (
            <p className="font-medium text-green-700">
              {reservation.modeOfPayment}
            </p>
          ) : reservation.status === "complete" ? (
            <p className="font-medium text-green-700">Complete</p>
          ) : reservation.status === "paid" ? (
            <p className="font-medium text-green-700">Paid</p>
          ) : (
            <p className="font-medium text-red-700">Canceled</p>
          )}
        </div>

        {reservation.status !== "canceled" ? (
          <Popover className="relative flex justify-end items-center">
            <PopoverButton>
              <Ellipsis className="h-5 w-5" />
            </PopoverButton>

            <PopoverPanel className="absolute z-50">
              <div
                className="absolute -right-0 z-10 mt-6 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                {reservation.status === "confirmed" &&
                reservation.checkIn <= currentDate &&
                reservation.checkOut > currentDate ? (
                  <div className="p-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          className="block bg-transparent text-start px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white rounded-md duration-200"
                        >
                          Cancel Reservation
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="space-y-5">
                          <DialogTitle>
                            Are you sure to cancel{" "}
                            {reservation.prefix +
                              " " +
                              reservation.firstName +
                              " " +
                              reservation.lastName}{" "}
                            ({reservation.reservationId}) reservation?
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            This action cannot be undone. This will permanently
                            cancel the reservation and remove the reservation
                            from our servers.
                          </DialogDescription>
                        </DialogHeader>

                        <section className="flex gap-x-6 px-10">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="rounded-md bg-gray-300"
                            >
                              No
                            </Button>
                          </DialogClose>

                          <Button
                            type="button"
                            className="bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={() =>
                              handleReservationDeletion(
                                reservation.reservationId
                              )
                            }
                          >
                            Yes, cancel it.
                          </Button>
                        </section>
                      </DialogContent>
                    </Dialog>
                    {/* Other buttons specific to an ongoing confirmed reservation */}
                  </div>
                ) : reservation.status === "confirmed" ? (
                  <div className="p-1">
                    <button
                      type="button"
                      className="block px-4 py-2 text-sm w-full text-start text-blue-600 hover:bg-blue-600 hover:text-white rounded-md duration-200"
                      onClick={() =>
                        handleSetUpdateReservation(reservation.reservationId)
                      }
                    >
                      Reschedule booking
                    </button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          className="block bg-transparent text-start px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white rounded-md duration-200"
                        >
                          Cancel Reservation
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="space-y-5">
                          <DialogTitle>
                            Are you sure to cancel{" "}
                            {reservation.prefix +
                              " " +
                              reservation.firstName +
                              " " +
                              reservation.lastName}{" "}
                            ({reservation.reservationId}) reservation?
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            This action cannot be undone. This will permanently
                            cancel the reservation and remove the reservation
                            from our servers.
                          </DialogDescription>
                        </DialogHeader>

                        <section className="flex gap-x-6 px-10">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="rounded-md bg-gray-300"
                            >
                              No
                            </Button>
                          </DialogClose>

                          <Button
                            type="button"
                            className="bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={() =>
                              handleReservationDeletion(
                                reservation.reservationId
                              )
                            }
                          >
                            Yes, cancel it.
                          </Button>
                        </section>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : reservation.status === "paid" ? (
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 rounded-md duration-200"
                    onClick={() =>
                      handleRequestEmailFeedback(
                        reservation.reservationId,
                        reservation.firstName,
                        reservation.lastName,
                        reservation.checkIn,
                        reservation.checkOut,
                        reservation.email
                      )
                    }
                    disabled={
                      feedbackMessage === "Sending" ||
                      feedbackMessage === "Email Sent!"
                    }
                  >
                    {feedbackMessage}
                  </button>
                ) : reservation.status === "complete" ? (
                  <div className="p-1">
                    <button
                      type="button"
                      className="block w-full text-start px-4 py-2 text-sm text-green-600 hover:bg-green-600 hover:text-white rounded-md duration-200"
                      onClick={() =>
                        handleReservationPaid(
                          reservation.reservationId,
                          reservation.status
                        )
                      }
                      disabled={
                        settingPaidMessage === "Updating Payment" ||
                        settingPaidMessage === "Reservation Fully Paid"
                      }
                    >
                      {settingPaidMessage}
                    </button>
                  </div>
                ) : reservation.status === "updating" ? (
                  <button
                    type="button"
                    className="block px-4 py-2 text-sm w-full text-start text-blue-600 hover:bg-blue-600 hover:text-white rounded-md duration-200"
                    onClick={() =>
                      handleSetUpdateReservation(reservation.reservationId)
                    }
                  >
                    Continue Reschedule Reservation
                  </button>
                ) : (
                  <>hehe</>
                )}
              </div>
            </PopoverPanel>
          </Popover>
        ) : (
          <></>
        )}
      </section>
    </div>
  );
};

export default ReservationList;
