import axios from "axios";

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const createCheckoutSession = async (
  amount: number,
  currency: string,
  description: string,
  metadata: any
) => {
  const reservationId = metadata.reservationId;

  const success_url = `${BASE_URL}/reservation-success/${reservationId}`;
  const cancel_url = "https://facebook.com";

  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            amount,
            currency,
            description,
            payment_method_types: [
              "card",
              "paymaya",
              "gcash",
              "grab_pay",
              "atome",
            ],
            merchant: "Crisanto Transient House Test Payment Page",
            line_items: [
              {
                name: "Booking Reservation Downpayment",
                quantity: 1,
                amount,
                currency,
              },
            ],
            redirect: {
              success: `${BASE_URL}/success`,
              failed: `${BASE_URL}/failed`,
            },
            metadata: {
              ...metadata,
            },
            send_email_receipt: true,
            success_url,
            cancel_url,
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            PAYMONGO_SECRET_KEY + ":"
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating checkout session:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create checkout session.");
  }
};
