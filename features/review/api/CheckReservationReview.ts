"use server";

import prisma from "@/lib/db";

// import { withAccelerate } from "@prisma/extension-accelerate";
// const prisma = new PrismaClient().$extends(withAccelerate());

export async function CheckReservationReview(reservationId: string) {
  if (reservationId) {
    const reservation = await prisma.reservation.findUnique({
      where: { reservationId, status: "paid" },
      include: {
        review: true,
      },
    });

    if (reservation?.status !== "paid") {
      return {
        success: false,
        state: "notPaid",
        message: "Reservation is not paid.",
      };
    }

    // If reservation exist then block them for leaving a review again.
    if (reservation?.review) {
      return {
        success: false,
      };
    } else return { success: true };
  }
}

export async function CheckReservationExist(reservationId: string) {
  if (reservationId) {
    const response = await prisma.reservation.findUnique({
      where: { reservationId },
    });

    if (!response) return { success: false };
    else return { success: true };
  }
}
