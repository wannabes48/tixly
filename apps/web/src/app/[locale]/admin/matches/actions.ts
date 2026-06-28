'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@tixly/database';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function updateKickoffTime(matchId: string, kickoffUtc: string) {
  await verifyAdmin();

  await prisma.match.update({
    where: { id: matchId },
    data: { kickoffUtc: new Date(kickoffUtc) }
  });

  revalidatePath('/[locale]/admin/matches', 'page');
  return { success: true };
}

export async function addPlatformInventory(matchId: string, category: string, quantity: number, pricePerTicket: number) {
  await verifyAdmin();

  await prisma.ticketListing.create({
    data: {
      matchId,
      sellerId: null, // Admin platform inventory
      category,
      quantity,
      pricePerTicket,
      deliveryMethod: 'MOBILE_TRANSFER',
      status: 'ACTIVE'
    }
  });

  revalidatePath('/[locale]/admin/matches', 'page');
  return { success: true };
}
