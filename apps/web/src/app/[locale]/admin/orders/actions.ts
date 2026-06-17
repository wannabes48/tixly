'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@tixly/database';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15' as any, // fallback to any to avoid type mismatch with local stripe package
});

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function issueRefund(orderId: string) {
  await verifyAdmin();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');
  if (order.status === 'REFUNDED') throw new Error('Order is already refunded');

  // Attempt Stripe refund if there's a payment intent
  if (order.stripePaymentIntentId) {
    try {
      await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
      });
    } catch (error: any) {
      console.error('Stripe refund failed:', error);
      throw new Error(`Stripe refund failed: ${error.message}`);
    }
  }

  // Update DB and Log
  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: 'REFUNDED' }
    }),
    prisma.orderLog.create({
      data: {
        orderId,
        action: 'REFUNDED',
        description: 'Admin issued a full refund.'
      }
    }),
    // Reactivate the listing quantity
    prisma.ticketListing.update({
      where: { id: order.listingId },
      data: { quantity: { increment: order.quantity } }
    })
  ]);

  revalidatePath('/[locale]/admin/orders', 'page');
  return { success: true };
}

export async function markDelivered(orderId: string) {
  await verifyAdmin();

  await prisma.$transaction([
    prisma.orderLog.create({
      data: {
        orderId,
        action: 'DELIVERED',
        description: 'Admin marked the tickets as delivered to the buyer.'
      }
    })
  ]);

  revalidatePath('/[locale]/admin/orders', 'page');
  return { success: true };
}

export async function openDispute(orderId: string, reason: string) {
  await verifyAdmin();

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  await prisma.$transaction([
    prisma.dispute.create({
      data: {
        orderId,
        userId: userId || 'SYSTEM',
        reason: 'ADMIN_OPENED',
        notes: reason
      }
    }),
    prisma.orderLog.create({
      data: {
        orderId,
        action: 'DISPUTE_OPENED',
        description: `Admin opened a dispute. Reason: ${reason}`
      }
    })
  ]);

  revalidatePath('/[locale]/admin/orders', 'page');
  return { success: true };
}

export async function addInternalNote(orderId: string, note: string) {
  await verifyAdmin();

  await prisma.orderLog.create({
    data: {
      orderId,
      action: 'NOTE_ADDED',
      description: note
    }
  });

  revalidatePath('/[locale]/admin/orders', 'page');
  return { success: true };
}
