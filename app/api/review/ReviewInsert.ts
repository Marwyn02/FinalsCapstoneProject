"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ReviewInsert = {
  reviewId: string;
  firstName: string;
  lastName: string;
  message: string;
  staff: string;
  valueForMoney: string;
  facilities: string;
  cleanliness: string;
  location: string;
  comfort: string;
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
  } = values;
  try {
    if (reviewId !== "") {
      await prisma.review.create({
        data: {
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
        },
      });

      revalidatePath("/admin-dashboard");
    }
  } catch (error) {
    console.error("Error in review creation: ", error);
    return { success: false, message: error };
  } finally {
    redirect("/admin-dashboard");
  }
}
