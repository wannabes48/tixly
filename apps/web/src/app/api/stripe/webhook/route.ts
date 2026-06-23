import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@tixly/database";
import { getPostHogClient } from "@/lib/posthog";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "account.updated":
      const account = event.data.object as any;
      
      // If Stripe says charges are enabled, they have passed KYC
      if (account.charges_enabled) {
        await prisma.user.updateMany({
          where: { stripeConnectId: account.id },
          data: { kycStatus: "VERIFIED" },
        });

        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: account.id,
          event: "seller_kyc_verified",
          properties: { stripe_account_id: account.id },
        });
        await posthog.flush();
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
