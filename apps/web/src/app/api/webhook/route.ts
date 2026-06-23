import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@tixly/database';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
});


const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      const listingId = paymentIntent.metadata.listingId;
      const quantity = parseInt(paymentIntent.metadata.quantity);
      const buyerEmail = paymentIntent.metadata.buyerEmail;
      const refundProtection = paymentIntent.metadata.refundProtection === 'true';

      const buyerFirstName = paymentIntent.metadata.buyerFirstName || '';
      const buyerLastName = paymentIntent.metadata.buyerLastName || '';
      const buyerPhone = paymentIntent.metadata.buyerPhone || '';
      const buyerName = `${buyerFirstName} ${buyerLastName}`.trim() || 'Guest Buyer';

      // Mark the order as paid in the database and reduce ticket inventory
      // (Simplified logic for now)
      
      const listing = await prisma.ticketListing.findUnique({ where: { id: listingId } });
      if (listing) {
        // Decrease quantity or mark SOLD if 0
        const newQuantity = listing.quantity - quantity;
        await prisma.ticketListing.update({
          where: { id: listingId },
          data: {
            quantity: newQuantity,
            status: newQuantity === 0 ? 'SOLD' : 'ACTIVE',
          }
        });

        // Create the Order record
        await prisma.order.create({
          data: {
            reference: `TIX-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            listingId,
            buyerEmail,
            buyerName,
            buyerPhone,
            quantity,
            subtotal: paymentIntent.amount / 100, // Roughly
            serviceFee: 0,
            total: paymentIntent.amount / 100,
            stripePaymentIntentId: paymentIntent.id,
            refundProtection,
            status: 'PAID',
            ticketHolders: [], // Populate from metadata in real app
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
