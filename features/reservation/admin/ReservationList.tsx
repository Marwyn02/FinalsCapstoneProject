"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Admin, Reservation } from "@/app/lib/types/types";
import { ReservationDelete } from "@/features/reservation/api/ReservationDelete";
import { ReservationPaid } from "@/features/reservation/api/ReservationPaid";
import { ReservationSetUpdate } from "@/features/reservation/api/ReservationSetUpdating";
import { ReservationSetComplete } from "../api/ReservationSetComplete";
import { computeNights } from "@/app/utils/ReservationHelpers";
import { RequestEmailFeedback } from "../utils/RequestEmailFeedback";

import { ChevronRight, KeyRound, Moon, MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

const ReservationList = ({
  reservations,
  admin,
}: {
  reservations: Reservation[];
  admin: Admin;
}) => {
  const currentDate = useMemo(() => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    return date;
  }, []);

  const [upcomingReservations, setUpcomingReservations] = useState<
    Reservation[] | null
  >([]);
  const [pendingPayment, setPendingPayment] = useState<Reservation[] | null>(
    []
  );
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
      const filteredPendingPayment = reservations
        .filter(
          (reservation: Reservation) =>
            reservation.checkOut < currentDate &&
            reservation.status === "pendingPayment"
        )
        .sort(
          (a, b) =>
            new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime()
        );

      // Paid Reservations
      const filteredPaidReservations = reservations
        .filter((reservation: Reservation) => reservation.status === "paid")
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

      // Current Reservations
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

      setPendingPayment(filteredPendingPayment);
      setCanceledReservations(filteredCanceledReservations);
      setUpcomingReservations(filteredUpcomingReservations);
      setPaidReservations(filteredPaidReservations);
      setUpdatingReservations(filteredUpdatingReservations);
      setCurrentReservation(filteredCurrentReservations);
    };

    fetchReservations();
  }, [currentDate, reservations]);
  return (
    <section className="px-28 py-12">
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
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                admin={admin}
              />
            ))
          ) : (
            <p>No upcoming reservations.</p>
          )}
        </TabsContent>

        <TabsContent value="complete" className="grid gap-2">
          {pendingPayment && pendingPayment.length > 0 ? (
            pendingPayment.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                admin={admin}
              />
            ))
          ) : (
            <p>No complete reservations.</p>
          )}
        </TabsContent>

        <TabsContent value="canceled" className="grid gap-2">
          {canceledReservations && canceledReservations.length > 0 ? (
            canceledReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                admin={admin}
              />
            ))
          ) : (
            <p>No canceled reservations.</p>
          )}
        </TabsContent>

        <TabsContent value="paid" className="grid gap-2">
          {paidReservations && paidReservations.length > 0 ? (
            paidReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                admin={admin}
              />
            ))
          ) : (
            <p>No paid reservations.</p>
          )}
        </TabsContent>

        <TabsContent value="updating" className="grid gap-2">
          {updatingReservations && updatingReservations.length > 0 ? (
            updatingReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                admin={admin}
              />
            ))
          ) : (
            <p>No updating reservations.</p>
          )}
        </TabsContent>
        <TabsContent value="current" className="grid gap-2">
          {currentReservation && currentReservation.length > 0 ? (
            currentReservation.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                admin={admin}
              />
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
  admin,
}: {
  reservation: Reservation;
  admin: Admin;
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Request Guest feedback"
  );
  const [settingPaidMessage, setSettingPaidMessage] =
    useState("Set fully paid");

  const handleReservationDeletion = async (
    reservationId: string,
    adminId: string
  ) => {
    if (reservationId !== "" && reservationId !== undefined && adminId) {
      await ReservationDelete(reservationId, adminId);
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
    setFeedbackMessage("Sending");
    if (values) {
      const response = await RequestEmailFeedback(values);
      if (response) {
        setFeedbackMessage(response.message);
      }
    }
  };

  const handleReservationPaid = async (
    reservationId: string,
    status: string
  ) => {
    setSettingPaidMessage("Updating payment");
    const response = await ReservationPaid(reservationId, status);
    if (response && response.success) {
      setSettingPaidMessage("Reservation fully paid");
    } else {
      setSettingPaidMessage("Updating failed");
    }
  };

  // Handle setting the reservation status to updating
  const handleSetUpdateReservation = async (reservationId: string) => {
    if (reservationId !== "") {
      await ReservationSetUpdate(reservationId);
      router.push(`/admin-dashboard/reservations/update/${reservationId}`);
    }
  };

  const handleSetPaidReservation = async (reservationId: string) => {
    const month = new Date(reservation.checkIn).getMonth() + 1;
    const year = new Date(reservation.checkIn).getFullYear();

    await ReservationSetComplete(
      reservationId,
      month.toString(),
      year.toString()
    );
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

            {reservation.nights && reservation.nights > 1 && (
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
            )}
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

              {reservation.pwd !== "0" && (
                <p>
                  {reservation.pwd}{" "}
                  {reservation.pwd && Number(reservation.pwd) > 1
                    ? "PWD"
                    : "PWD"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="relative flex justify-end items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={reservation.status === "canceled"}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(reservation.reservationId)
                }
              >
                Copy reservation ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/admin-dashboard/reservations/${reservation.reservationId}`
                  )
                }
              >
                Open reservation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {reservation.status === "confirmed" ? (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      handleSetUpdateReservation(reservation.reservationId)
                    }
                  >
                    Reschedule reservation
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    Cancel reservation
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      handleSetPaidReservation(reservation.reservationId)
                    }
                  >
                    Set Paid reservation
                  </DropdownMenuItem>
                </>
              ) : reservation.status === "paid" ? (
                <DropdownMenuItem
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
                </DropdownMenuItem>
              ) : reservation.status === "pendingPayment" ? (
                <DropdownMenuItem
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
                </DropdownMenuItem>
              ) : (
                reservation.status === "updating" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleSetUpdateReservation(reservation.reservationId)
                    }
                  >
                    Continue reschedule reservation
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure to cancel{" "}
                    {reservation.prefix +
                      " " +
                      reservation.firstName +
                      " " +
                      reservation.lastName +
                      " " +
                      "(" +
                      reservation.reservationId +
                      ")"}{" "}
                    reservation?
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    This action cannot be undone. This will permanently delete
                    the reservation and remove it from our servers.
                  </DialogDescription>
                </DialogHeader>

                <section className="flex gap-x-6 px-10">
                  <DialogClose asChild>
                    <Button type="button" className="rounded-md bg-gray-300">
                      No
                    </Button>
                  </DialogClose>

                  <Button
                    type="button"
                    className="bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() =>
                      handleReservationDeletion(
                        reservation.reservationId,
                        admin.adminId
                      )
                    }
                  >
                    Yes, cancel it.
                  </Button>
                </section>
              </DialogContent>
            </Dialog>
          </DropdownMenu>
        </div>
      </section>
    </div>
  );
};

export default ReservationList;
