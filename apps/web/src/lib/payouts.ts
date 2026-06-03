import { stripe } from "@/lib/stripe";
import { prisma } from "@tixly/database";

// Tixly takes a 10% commission on the ticket price
const PLATFORM_COMMISSION_RATE = 0.10;

/**
 * Triggers a payout (Stripe Transfer) to the seller of a given order.
 * This should be called 48 hours after delivery or when the buyer confirms receipt.
 */
export async function triggerSellerPayout(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      listing: {
        include: { seller: true }
      }
    }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "COMPLETED" && order.status !== "DELIVERED") {
    throw new Error("Order is not in a state ready for payout");
  }

  const seller = order.listing.seller;
  if (!seller) {
    throw new Error("Listing has no seller");
  }

  if (!seller.stripeConnectId || seller.kycStatus !== "VERIFIED") {
    throw new Error("Seller has not completed KYC/Connect onboarding");
  }

  // Check if payout was already made (could add a payoutStatus to Order schema in future)
  // For MVP, we'll assume calling this function is idempotent or guarded by the caller

  // Calculate seller payout
  // Subtotal is what the tickets cost. We keep 10% of that.
  const commission = order.subtotal * PLATFORM_COMMISSION_RATE;
  const payoutAmount = order.subtotal - commission;

  // Stripe Transfers expect integer cents
  const payoutAmountCents = Math.round(payoutAmount * 100);

  // Trigger transfer from Platform Account to Connected Account
  const transfer = await stripe.transfers.create({
    amount: payoutAmountCents,
    currency: "usd",
    destination: seller.stripeConnectId,
    description: `Payout for order ${order.reference}`,
    metadata: {
      orderId: order.id,
      listingId: order.listing.id
    }
  });

  return transfer;
}
