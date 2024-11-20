import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function ReservationSetUpdate(reservationId: string) {
  try {
    const response = await prisma.reservation.update({
      where: {
        reservationId,
      },
      data: {
        status: "updating",
      },
    });
    if (response) {
      console.log("Reservation set to update status!");
      revalidatePath(`/admin-dashboard/reservations/update/${reservationId}`);
      redirect(`/admin-dashboard/reservations/update/${reservationId}`);
    }
    return response;
  } catch (error) {
    console.error("Error in reservation setting to update status, ", error);
  }
}
