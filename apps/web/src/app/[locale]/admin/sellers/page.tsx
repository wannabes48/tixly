import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@tixly/database';
import { SellersClient } from './SellersClient';

export const dynamic = 'force-dynamic';

export default async function AdminSellersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/en/admin/sellers');
  }

  const user = session.user as any;
  if (user.role !== 'ADMIN') {
    redirect('/en/account');
  }

  // Fetch all sellers with their listings and associated orders for financials
  const sellers = await prisma.user.findMany({
    where: { role: 'SELLER' },
    include: {
      listings: {
        include: {
          orders: {
            where: { status: 'PAID' }
          }
        }
      },
      reviewsReceived: true
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy mb-2">Sellers Management</h1>
        <p className="text-slate-500">Manage seller accounts, KYC verifications, and payouts.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <SellersClient initialSellers={sellers} />
      </div>
    </div>
  );
}
