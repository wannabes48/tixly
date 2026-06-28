'use client';

import React, { useState, useTransition } from 'react';
import { Search, ShieldCheck, Ban, PauseCircle, Activity, Star } from 'lucide-react';
import { verifyKyc, suspendSeller, banSeller } from './actions';

export function SellersClient({ initialSellers }: { initialSellers: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [kycFilter, setKycFilter] = useState('ALL');
  const [isPending, startTransition] = useTransition();

  const processedSellers = initialSellers.map(seller => {
    // Calculate total sales from completed orders on their listings
    let totalSalesVolume = 0;
    seller.listings.forEach((l: any) => {
      l.orders.forEach((o: any) => {
        totalSalesVolume += o.subtotal; // Using subtotal representing what the seller listed it for
      });
    });

    // Mock pending payout (10% of total sales for demo purposes, or based on un-delivered tickets)
    const pendingPayout = totalSalesVolume * 0.15;

    // Calculate rating
    const avgRating = seller.reviewsReceived.length > 0 
      ? seller.reviewsReceived.reduce((sum: number, r: any) => sum + r.rating, 0) / seller.reviewsReceived.length
      : 4.5 + (Math.random() * 0.5); // Mock rating if none

    return {
      ...seller,
      totalSalesVolume,
      pendingPayout,
      avgRating
    };
  });

  const filteredSellers = processedSellers.filter(seller => {
    const matchesSearch = 
      (seller.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (seller.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesKyc = kycFilter === 'ALL' || seller.kycStatus === kycFilter;
    
    return matchesSearch && matchesKyc;
  });

  const getKycColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-orange-100 text-orange-700';
      case 'UNVERIFIED': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <>
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search seller name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['ALL', 'VERIFIED', 'PENDING', 'UNVERIFIED'].map(status => (
            <button
              key={status}
              onClick={() => setKycFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                kycFilter === status 
                  ? 'bg-brand-navy text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
              <th className="p-4 font-semibold">Seller Profile</th>
              <th className="p-4 font-semibold">KYC Status</th>
              <th className="p-4 font-semibold">Rating</th>
              <th className="p-4 font-semibold">Total Sales</th>
              <th className="p-4 font-semibold">Pending Payout</th>
              <th className="p-4 font-semibold">Account Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSellers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No sellers found matching your filters.
                </td>
              </tr>
            ) : (
              filteredSellers.map(seller => (
                <tr key={seller.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-brand-navy">{seller.name || 'Anonymous User'}</div>
                    <div className="text-xs text-slate-500">{seller.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getKycColor(seller.kycStatus)}`}>
                      {seller.kycStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-semibold text-brand-navy">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {seller.avgRating.toFixed(1)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-brand-navy">${seller.totalSalesVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <div className="text-xs text-slate-500">{seller.listings.length} active listings</div>
                  </td>
                  <td className="p-4 font-bold text-brand-orange">
                    ${seller.pendingPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    {seller.isBanned ? (
                      <span className="text-red-600 font-bold text-xs uppercase flex items-center gap-1"><Ban className="w-3 h-3"/> Banned</span>
                    ) : seller.isSuspended ? (
                      <span className="text-orange-600 font-bold text-xs uppercase flex items-center gap-1"><PauseCircle className="w-3 h-3"/> Suspended</span>
                    ) : (
                      <span className="text-green-600 font-bold text-xs uppercase flex items-center gap-1"><Activity className="w-3 h-3"/> Active</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {seller.kycStatus === 'PENDING' && (
                        <button 
                          onClick={() => startTransition(async () => { await verifyKyc(seller.id); })}
                          disabled={isPending}
                          className="p-1.5 bg-slate-100 hover:bg-green-100 text-slate-400 hover:text-green-600 rounded-lg transition-colors disabled:opacity-50" title="Verify KYC">
                          <ShieldCheck className="w-5 h-5" />
                        </button>
                      )}
                      {!seller.isSuspended && !seller.isBanned && (
                        <button 
                          onClick={() => startTransition(async () => { await suspendSeller(seller.id); })}
                          disabled={isPending}
                          className="p-1.5 bg-slate-100 hover:bg-orange-100 text-slate-400 hover:text-orange-600 rounded-lg transition-colors disabled:opacity-50" title="Suspend Account">
                          <PauseCircle className="w-5 h-5" />
                        </button>
                      )}
                      {!seller.isBanned && (
                        <button 
                          onClick={() => startTransition(async () => { await banSeller(seller.id); })}
                          disabled={isPending}
                          className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50" title="Ban Account">
                          <Ban className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
