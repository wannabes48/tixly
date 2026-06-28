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

export async function setListingStatus(listingId: string, status: 'ACTIVE' | 'CANCELLED') {
  await verifyAdmin();

  await prisma.ticketListing.update({
    where: { id: listingId },
    data: { status }
  });

  revalidatePath('/[locale]/admin/listings', 'page');
  return { success: true };
}
