import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@tixly/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
});


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listingId, quantity, refundProtection, buyerInfo, sessionId } = body;

    const buyerPhone = `${buyerInfo.dialCode} ${buyerInfo.phone}`.trim();

    if (sessionId) {
      // Update TicketHold with latest info including phone
      const hold = await prisma.ticketHold.findFirst({ where: { sessionId } });
      if (hold) {
        await prisma.ticketHold.update({
          where: { id: hold.id },
          data: {
            buyerFirstName: buyerInfo.firstName,
            buyerLastName: buyerInfo.lastName,
            buyerEmail: buyerInfo.email,
            buyerPhone: buyerPhone
          }
        });
      }
    }

    // Validate listing exists
    const listing = await prisma.ticketListing.findUnique({
      where: { id: listingId },
    });

    let pricePerTicket = 150; // Fallback for testing
    if (listing) {
      if (listing.quantity < quantity) {
        return NextResponse.json({ error: 'Not enough tickets available' }, { status: 400 });
      }
      pricePerTicket = listing.pricePerTicket;
    } else {
      console.warn(`Listing ${listingId} not found in DB. Using fallback price for testing.`);
    }

    // Calculate total
    const serviceFeePercent = 0.10;
    const subtotal = quantity * pricePerTicket;
    const serviceFee = subtotal * serviceFeePercent;
    const protectionFee = refundProtection ? (subtotal * 0.08) : 0;
    const totalAmount = subtotal + serviceFee + protectionFee;
    
    // Convert to cents for Stripe
    const amountInCents = Math.round(totalAmount * 100);


    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        listingId,
        quantity: quantity.toString(),
        buyerEmail: buyerInfo.email,
        buyerFirstName: buyerInfo.firstName,
        buyerLastName: buyerInfo.lastName,
        buyerPhone: buyerPhone,
        refundProtection: refundProtection ? 'true' : 'false',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
