"use server";

import prisma from "@/lib/db";

type ReservationCreate = {
  reservationId: string;
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  modeOfPayment: string;
  checkIn: Date;
  checkOut: Date;
  adult: string;
  children: string;
  pwd: string;
  downpayment: string;
  payment: string;
  status: string;
};

export async function ReservationCreate(values: ReservationCreate) {
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
