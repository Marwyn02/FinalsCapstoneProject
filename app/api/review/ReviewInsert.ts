"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

type ReviewInsert = {
  reviewId?: string;
  firstName: string;
  lastName: string;
  message: string;
  staff: string;
  valueForMoney: string;
  facilities: string;
  cleanliness: string;
  location: string;
  comfort: string;
  status: string;
  reservationId?: string;
};

export default async function ReviewInsert(values: ReviewInsert) {
  const {
    reviewId,
    firstName,
    lastName,
    message,
    staff,
    valueForMoney,
    facilities,
    cleanliness,
    location,
    comfort,
    status,
    reservationId,
  } = values;

  if (reviewId && reservationId) {
    const reservation = await prisma.reservation.findUnique({
      where: {
        reservationId,
      },
      include: {
        review: true,
      },
    });

    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    // Check if a review already exists
    if (reservation.review) {
      return { success: false, message: "Review already exist." };
    }

    const getRatingAverage =
      (Number(staff) +
        Number(valueForMoney) +
        Number(facilities) +
        Number(cleanliness) +
        Number(location) +
        Number(comfort)) /
      6;

    const response = await prisma.review.create({
      data: {
        reviewId,
        firstName,
        lastName,
        message,
        rating: getRatingAverage.toFixed(1).toString(),
        staff,
        valueForMoney,
        facilities,
        cleanliness,
        location,
        comfort,
        status, // pending
        reservationId,
      },
    });

    if (response) {
      revalidatePath(`/feedback/${reservationId}`);
    }
  } else if (reviewId) {
    const getRatingAverage =
      (Number(staff) +
        Number(valueForMoney) +
        Number(facilities) +
        Number(cleanliness) +
        Number(location) +
        Number(comfort)) /
      6;

    const response = await prisma.review.create({
      data: {
        reviewId,
        firstName,
        lastName,
        message,
        rating: getRatingAverage.toFixed(1).toString(),
        staff,
        valueForMoney,
        facilities,
        cleanliness,
        location,
        comfort,
        status, // pending
        reservationId: null,
      },
    });

    if (response) {
      revalidatePath(`/memories-and-reviews`);
    }
  }
}
