"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// import { withAccelerate } from "@prisma/extension-accelerate";
// const prisma = new PrismaClient().$extends(withAccelerate());

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

  try {
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
  } catch (error) {
    console.error("Error in reservation creation: ", error);
    return { success: false, message: error };
  }
}

// Get only one reservation that matches the id
// This uses in the reservation-success
export async function getReservation(reservationId: string) {
  const reservation = await prisma.reservation.findFirst({
    where: {
      reservationId,
    },
  });

  return reservation;
}

// Get all reservation for the disable dates especially
export async function getAllReservation() {
  const today = new Date();

  // const reservation = await prisma.reservation.findMany({
  //   where: {
  //     checkOut: {
  //       gt: today,
  //     },
  //   },
  // });

  const reservation = await prisma.reservation.findMany();

  return reservation;
}

// Get all reservations that is not pending
export async function getAllConfirmedReservation() {
  const reservation = await prisma.reservation.findMany({
    where: {
      NOT: {
        status: "pending",
      },
    },
  });

  return reservation;
}
