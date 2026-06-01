import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/en/admin');
  }

  const user = session.user as any;
  if (user.role !== 'ADMIN') {
    redirect('/en/account');
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy mb-2">Admin Overview</h1>
            <p className="text-slate-500">Manage platform operations and monitor performance.</p>
          </div>
          <button className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md">
            Generate Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-brand-navy rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-500 text-sm font-semibold mb-1">Total Users</div>
              <div className="text-2xl font-bold text-brand-navy">12,450</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-500 text-sm font-semibold mb-1">Active Listings</div>
              <div className="text-2xl font-bold text-brand-navy">3,892</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-500 text-sm font-semibold mb-1">Completed Sales</div>
              <div className="text-2xl font-bold text-brand-navy">1,240</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-500 text-sm font-semibold mb-1">Revenue</div>
              <div className="text-2xl font-bold text-brand-navy">$45.2k</div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-bold text-brand-navy mb-6">Recent Platform Activity</h2>
              
              <div className="space-y-6">
                {[
                  { id: 1, action: "New user registered", user: "alex@example.com", time: "10 mins ago", color: "bg-blue-500" },
                  { id: 2, action: "Ticket listed", user: "Sarah T.", detail: "Brazil vs Argentina - $450", time: "25 mins ago", color: "bg-brand-orange" },
                  { id: 3, action: "Transaction completed", user: "mike89", detail: "Order #89204", time: "1 hour ago", color: "bg-green-500" },
                  { id: 4, action: "KYC Verified", user: "john_doe", time: "2 hours ago", color: "bg-purple-500" },
                ].map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${item.color}`}></div>
                      <div className="w-px h-full bg-slate-200 my-1"></div>
                    </div>
                    <div className="pb-4">
                      <div className="font-bold text-brand-navy">{item.action}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        <span className="font-semibold">{item.user}</span> {item.detail && `• ${item.detail}`}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 border border-slate-200 text-brand-navy font-bold rounded-xl hover:bg-slate-50 transition-colors">
                View All Activity
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-brand-navy rounded-3xl shadow-sm p-8 text-white">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-white/10 hover:bg-white/20 text-left px-5 py-3 rounded-xl transition-colors font-semibold flex items-center justify-between">
                  Review KYC Pending
                  <span className="bg-brand-orange text-white text-xs px-2 py-1 rounded-full">12</span>
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-left px-5 py-3 rounded-xl transition-colors font-semibold flex items-center justify-between">
                  Manage Users
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-left px-5 py-3 rounded-xl transition-colors font-semibold flex items-center justify-between">
                  System Settings
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-bold text-brand-navy mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Database</span>
                  <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Payment Gateway</span>
                  <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Email Service</span>
                  <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                  </span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
