import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@tixly/database';
import { MatchesClient } from './MatchesClient';

export const dynamic = 'force-dynamic';

export default async function AdminMatchesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/en/admin/matches');
  }

  const user = session.user as any;
  if (user.role !== 'ADMIN') {
    redirect('/en/account');
  }

  const matches = await prisma.match.findMany({
    orderBy: { matchNumber: 'asc' },
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
      listings: {
        where: { sellerId: null } // Platform inventory
      }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy mb-2">Match & Inventory Management</h1>
        <p className="text-slate-500">Edit match schedules and add VIP platform inventory.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <MatchesClient initialMatches={matches} />
      </div>
    </div>
  );
}
