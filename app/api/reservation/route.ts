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
    contactNumber,
    modeOfPayment,
    checkIn,
    checkOut,
    adult,
    children,
    payment,
  } = values;

  try {
    if (values.firstName !== "") {
      await prisma.reservation.create({
        data: {
          reservationId,
          prefix,
          firstName,
          lastName,
          email,
          phoneNumber: contactNumber,
          modeOfPayment,
          checkIn,
          checkOut,
          adult,
          children,
          payment,
        },
      });
    }

    revalidatePath("/reservation-success");
  } catch (error) {
    console.error("Error in reservation creation: ", error);
    return { success: false, message: error };
  } finally {
    redirect("/reservation-success");
  }
}

// Get only one reservation that matches the id
// This uses in the reservation-success
export async function getReservation(id: string) {
  const reservation = await prisma.reservation.findFirst({
    where: {
      reservationId: id,
    },
  });

  return reservation;
}

// Get all reservation for the disable dates especially
export async function getAllReservation() {
  const reservation = await prisma.reservation.findMany();

  return reservation;
}
