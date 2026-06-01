import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@tixly/database';
import { ListingsClient } from './ListingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminListingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/en/admin/listings');
  }

  const user = session.user as any;
  if (user.role !== 'ADMIN') {
    redirect('/en/account');
  }

  // Fetch listings for moderation queue
  const listings = await prisma.ticketListing.findMany({
    orderBy: { match: { kickoffUtc: 'asc' } },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
          stadium: true
        }
      },
      seller: true
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy mb-2">Listings Moderation</h1>
        <p className="text-slate-500">Approve, reject, and monitor secondary ticket listings.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <ListingsClient initialListings={listings} />
      </div>
    </div>
  );
}
