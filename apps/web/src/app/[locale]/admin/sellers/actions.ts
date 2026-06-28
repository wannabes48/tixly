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

export async function verifyKyc(userId: string) {
  await verifyAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: 'VERIFIED' }
  });

  revalidatePath('/[locale]/admin/sellers', 'page');
  return { success: true };
}

export async function suspendSeller(userId: string) {
  await verifyAdmin();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true }
    }),
    prisma.ticketListing.updateMany({
      where: { sellerId: userId, status: 'ACTIVE' },
      data: { status: 'CANCELLED' }
    })
  ]);

  revalidatePath('/[locale]/admin/sellers', 'page');
  return { success: true };
}

export async function banSeller(userId: string) {
  await verifyAdmin();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { isBanned: true, isSuspended: true }
    }),
    prisma.ticketListing.updateMany({
      where: { sellerId: userId, status: 'ACTIVE' },
      data: { status: 'CANCELLED' }
    })
  ]);

  revalidatePath('/[locale]/admin/sellers', 'page');
  return { success: true };
}
