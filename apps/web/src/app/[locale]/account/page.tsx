import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { Link } from '@/navigation';

export default async function AccountDashboardPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/en/account');
  }

  // Mock data for display purposes
  const user = session.user as any;
  const activeListings = [
    { id: '1', match: 'Brazil vs Argentina', date: 'Jul 15, 2026', price: '$450', status: 'Active', section: '102', row: '14' },
    { id: '2', match: 'Spain vs Italy', date: 'Jul 12, 2026', price: '$320', status: 'Pending', section: '205', row: 'A' },
  ];

  const pastPurchases = [
    { id: '101', match: 'USA vs England', date: 'Jun 20, 2026', price: '$250', status: 'Completed', tickets: 2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header Profile Section */}
        <div className="bg-brand-navy rounded-3xl p-8 md:p-10 text-white mb-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-orange rounded-full opacity-10 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-24 h-24 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
              <p className="text-slate-300 mb-4">{user.email} • Role: {user.role}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link href="/en/sell/list" className="bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-xl transition-colors text-sm shadow-md">
                  List New Ticket
                </Link>
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-2 px-6 rounded-xl transition-colors text-sm">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Active Listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-brand-navy">Active Listings</h2>
              <Link href="/en/sell" className="text-brand-orange font-semibold hover:underline text-sm">View All</Link>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {activeListings.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {activeListings.map(listing => (
                    <div key={listing.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-lg text-brand-navy mb-1">{listing.match}</div>
                        <div className="text-sm text-slate-500 mb-2">{listing.date} • Sec {listing.section}, Row {listing.row}</div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          listing.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        <div className="text-2xl font-bold text-brand-navy">{listing.price}</div>
                        <button className="text-slate-400 hover:text-brand-orange transition-colors text-sm font-semibold">
                          Edit Listing
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-slate-500">
                  No active listings currently.
                </div>
              )}
            </div>
          </div>

          {/* Past Purchases */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-navy">Recent Purchases</h2>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {pastPurchases.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {pastPurchases.map(purchase => (
                    <div key={purchase.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-brand-navy">{purchase.match}</div>
                        <div className="font-bold text-brand-navy">{purchase.price}</div>
                      </div>
                      <div className="text-sm text-slate-500 mb-3">{purchase.date} • {purchase.tickets} Tickets</div>
                      <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-brand-navy font-semibold rounded-xl text-sm transition-colors">
                        View Tickets
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No recent purchases found.
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-brand-navy to-slate-800 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-4 opacity-90">Account Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">Total Earned</span>
                  <span className="font-bold text-xl">$0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Tickets Sold</span>
                  <span className="font-bold text-xl">0</span>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
