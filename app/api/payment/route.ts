import { NextResponse } from "next/server";
import { createCheckoutSession } from "../createCheckoutSession/route";

export async function POST(req: Request) {
  try {
    const { amount, currency, description, metadata } = await req.json();

    if (!amount || !currency || !description) {
      return NextResponse.json(
        { error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const checkoutSession = await createCheckoutSession(
      amount,
      currency,
      description,
      metadata
    );
    return NextResponse.json(
      { checkoutUrl: checkoutSession.data.attributes.checkout_url },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
