import { ProfitInitialUpdate } from "../api/profit/ProfitSetAndAdd";
import { Profit, Reservation } from "../lib/types/types";

export const calculateTotalProfit = async (
  reservation: Reservation,
  allProfits: Profit[]
) => {
  const checkInMonth = new Date(reservation.checkIn).getMonth() + 1;
  const checkInYear = new Date(reservation.checkIn).getFullYear();

  // Find the matching profit record for the reservation's month and year
  const profit = allProfits.find(
    (profit: Profit) =>
      profit.month === checkInMonth.toString() &&
      profit.year === checkInYear.toString()
  );

  if (profit && Number(reservation.downpayment) > 0) {
    const values = {
      profitId: profit.profitId,
      profit: Number(reservation.downpayment),
      bookings: 1,
      reservationId: reservation.reservationId,
    };

    // Update the profit in the database
    await ProfitInitialUpdate(values);
  }
};
