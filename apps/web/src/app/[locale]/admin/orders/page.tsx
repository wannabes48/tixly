import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@tixly/database';
import { OrdersClient } from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/en/admin/orders');
  }

  const user = session.user as any;
  if (user.role !== 'ADMIN') {
    redirect('/en/account');
  }

  // Fetch all orders with deep relations for the table & modal
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      logs: {
        orderBy: { createdAt: 'desc' }
      },
      listing: {
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
      }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy mb-2">Orders Management</h1>
        <p className="text-slate-500">View and manage all platform transactions.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <OrdersClient initialOrders={orders} />
      </div>
    </div>
  );
}
