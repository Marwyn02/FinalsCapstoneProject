"use server";

import prisma from "@/lib/db";

export async function createReservation(values: any) {
  const {
    reservationId,
    prefix,
    firstName,
    lastName,
    email,
    phoneNumber,
    modeOfPayment,
    checkIn,
    checkOut,
    adult,
    children,
    pwd,
    downpayment,
    payment,
    status,
  } = values;

  const checkReservationId = await prisma.reservation.findUnique({
    where: {
      reservationId,
    },
  });

  if (!checkReservationId) {
    if (values.firstName !== "") {
      await prisma.reservation.create({
        data: {
          reservationId,
          prefix,
          firstName,
          lastName,
          email,
          phoneNumber,
          modeOfPayment,
          checkIn,
          checkOut,
          adult,
          children,
          pwd,
          downpayment,
          payment,
          status,
        },
      });
    }
  }
}

// Get only one reservation that matches the id
// This uses in the reservation-success
export async function ReservationFetchOne(reservationId: string) {
  const reservation = await prisma.reservation.findFirst({
    where: {
      reservationId,
    },
  });

  return reservation;
}

// Get all reservations that is not pending
// Past getAllConfirmedReservation
export async function ReservationFetchAll() {
  const reservation = await prisma.reservation.findMany({
    where: {
      NOT: {
        status: "pending",
      },
    },
  });

  return reservation;
}

export async function ReservationSpecialDate() {
  const reservation = await prisma.reservation.findMany({
    where: {
      NOT: {
        OR: [{ status: "pending" }, { status: "canceled" }],
      },
    },
  });

  return reservation;
}
