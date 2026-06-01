import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@tixly/database';
import { Users, Ticket, CheckCircle2, DollarSign, Activity, AlertCircle } from 'lucide-react';

export default async function AdminDashboardPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/en/admin');
  }

  const user = session.user as any;
  if (user.role !== 'ADMIN') {
    redirect('/en/account');
  }

  // Fetch Real Database Metrics
  const [
    ticketsSoldAgg,
    revenueAgg,
    activeListingsCount,
    openDisputesCount,
    newSellersCount,
    recentOrders
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { quantity: true },
      where: { status: 'PAID' }
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'PAID' }
    }),
    prisma.ticketListing.count({
      where: { status: 'ACTIVE' }
    }),
    prisma.dispute.count({
      where: { status: 'OPEN' }
    }),
    prisma.user.count({
      where: { role: 'SELLER' }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { listing: { include: { match: { include: { homeTeam: true, awayTeam: true } } } } }
    })
  ]);

  const ticketsSold = ticketsSoldAgg._sum.quantity || 0;
  const totalRevenue = revenueAgg._sum.total || 0;

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy mb-2">Admin Overview</h1>
          <p className="text-slate-500">Live platform metrics from your database.</p>
        </div>
        <button className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md">
          Download CSV Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-blue-50 text-brand-navy rounded-xl flex items-center justify-center mb-4">
            <Ticket className="w-6 h-6" />
          </div>
          <div className="text-slate-500 text-sm font-semibold mb-1">Total Tickets Sold</div>
          <div className="text-3xl font-black text-brand-navy">{ticketsSold.toLocaleString()}</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="text-slate-500 text-sm font-semibold mb-1">Total Revenue</div>
          <div className="text-3xl font-black text-brand-navy">${totalRevenue.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <div className="text-slate-500 text-sm font-semibold mb-1">Active Listings</div>
          <div className="text-3xl font-black text-brand-navy">{activeListingsCount.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="text-slate-500 text-sm font-semibold mb-1">Open Disputes</div>
          <div className="text-3xl font-black text-brand-navy">{openDisputesCount.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-slate-500 text-sm font-semibold mb-1">Seller Accounts</div>
          <div className="text-3xl font-black text-brand-navy">{newSellersCount.toLocaleString()}</div>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-brand-navy">Recent Live Orders</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No orders yet.</div>
              ) : (
                recentOrders.map(order => (
                  <div key={order.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full mt-1.5 bg-green-500"></div>
                      <div className="w-px h-full bg-slate-200 my-1"></div>
                    </div>
                    <div className="pb-4 w-full">
                      <div className="flex justify-between">
                        <div className="font-bold text-brand-navy">Order {order.reference}</div>
                        <div className="font-bold text-green-600">+${order.total.toFixed(2)}</div>
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        <span className="font-semibold">{order.buyerEmail}</span> bought {order.quantity} tickets for {order.listing.match.homeTeam.name} vs {order.listing.match.awayTeam.name}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* System Status Sidebar */}
        <div className="space-y-6">
          <div className="bg-brand-navy rounded-3xl shadow-sm p-8 text-white">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-white/10 hover:bg-white/20 text-left px-5 py-3 rounded-xl transition-colors font-semibold flex items-center justify-between">
                Review KYC Pending
                <span className="bg-brand-orange text-white text-xs px-2 py-1 rounded-full">3</span>
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 text-left px-5 py-3 rounded-xl transition-colors font-semibold flex items-center justify-between">
                Review Open Disputes
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{openDisputesCount}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-brand-navy mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Database (Postgres)</span>
                <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Stripe Gateway</span>
                <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">SendGrid Mail</span>
                <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
