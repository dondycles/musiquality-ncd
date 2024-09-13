import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: "2024-06-20",
  });
  const sig = req.headers.get("stripe-signature") || "";
  const webHookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const reqText = await req.text();
  const reqBuffer = Buffer.from(reqText);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, webHookSecret);
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const retrieveOrder = await stripe.paymentIntents.retrieve(event.id);
      const charge = retrieveOrder.latest_charge as Stripe.Charge;

      charge.receipt_url;
  }
}
