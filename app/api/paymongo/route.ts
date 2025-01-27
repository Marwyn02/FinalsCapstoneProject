import { NextResponse } from "next/server";
import { ReservationCreate } from "@/features/reservation/api/ReservationCreate";

// Setup for paymongo!

// Step 1:
// Set the NGROK http link.

// Step 2: Go to paymongo, and create a webhook.
// Set the ngrok url / api / paymongo - which is the file path of your paymongo webhook api (which is this one).

// Step 3: Set events attribute:
// source.chargeable, payment.paid, payment.failed, checkout_session.payment.paid

// And you're done!

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    switch (data.attributes.type) {
      case "checkout_session.payment.paid":
        await handleCheckoutSessionPaymentPaid(data);
        break;
      case "payment.paid":
        await handlePaymentPaid(data);
        break;
      case "payment.failed":
        await handlePaymentFailure(data);
        break;
      default:
        console.warn(`Unhandled event type: ${data.attributes.type}`);
    }

    return NextResponse.json({ message: "Webhook Received" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionPaymentPaid(data: any) {
  const { attributes } = data.attributes.data;

  const paymentMethodUsed = attributes.payment_method_used;

  const reservationData = {
    reservationId: attributes.metadata.reservationId,
    prefix: attributes.metadata.prefix,
    firstName: attributes.metadata.firstName,
    lastName: attributes.metadata.lastName,
    email: attributes.metadata.email,
    phoneNumber: attributes.metadata.phoneNumber,
    modeOfPayment: paymentMethodUsed,
    checkIn: new Date(attributes.metadata.checkIn),
    checkOut: new Date(attributes.metadata.checkOut),
    adult: attributes.metadata.adult,
    children: attributes.metadata.children,
    pwd: attributes.metadata.pwd,
    downpayment: attributes.metadata.downpayment,
    payment: attributes.metadata.payment,
    status: attributes.metadata.status,
  };
  await ReservationCreate(reservationData);
}

async function handlePaymentPaid(data: any) {
  // Handle payment success logic here
  // For example, update your database with the payment status
}

async function handlePaymentFailure(data: any) {
  // Handle payment failure logic here
  // For example, update your database with the payment status
}

export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
