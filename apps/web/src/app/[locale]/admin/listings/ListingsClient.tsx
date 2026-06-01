'use client';

import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, XCircle, FileWarning } from 'lucide-react';

export function ListingsClient({ initialListings }: { initialListings: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  // Suspicious logic: price > 5000 or seller is unverified
  const getFlags = (listing: any) => {
    const flags = [];
    if (listing.pricePerTicket > 5000) flags.push('Suspicious Pricing');
    if (listing.seller && listing.seller.kycStatus === 'UNVERIFIED') flags.push('Unverified Seller');
    return flags;
  };

  const filteredListings = initialListings.filter(listing => {
    const flags = getFlags(listing);
    const matchesSearch = 
      (listing.seller?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (listing.seller?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'FLAGGED') return matchesSearch && flags.length > 0;
    if (filter === 'ACTIVE') return matchesSearch && listing.status === 'ACTIVE';
    if (filter === 'CANCELLED') return matchesSearch && listing.status === 'CANCELLED';
    return matchesSearch;
  });

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
          {['ALL', 'FLAGGED', 'ACTIVE', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                filter === status 
                  ? 'bg-brand-navy text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'FLAGGED' && <ShieldAlert className="w-4 h-4" />}
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
              <th className="p-4 font-semibold">Seller Info</th>
              <th className="p-4 font-semibold">Match</th>
              <th className="p-4 font-semibold">Details</th>
              <th className="p-4 font-semibold">Price/Tkt</th>
              <th className="p-4 font-semibold">Status & Flags</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No listings found matching your filters.
                </td>
              </tr>
            ) : (
              filteredListings.map(listing => {
                const flags = getFlags(listing);
                return (
                  <tr key={listing.id} className={`border-b border-slate-50 transition-colors ${flags.length > 0 ? 'bg-orange-50/30' : 'hover:bg-slate-50'}`}>
                    <td className="p-4">
                      {listing.seller ? (
                        <>
                          <div className="font-bold text-brand-navy">{listing.seller.name || 'Anonymous'}</div>
                          <div className="text-xs text-slate-500">{listing.seller.email}</div>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-slate-500 italic">Admin Inventory</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-brand-navy max-w-[180px] truncate">
                        {listing.match.homeTeam.name} vs {listing.match.awayTeam.name}
                      </div>
                      <div className="text-xs text-slate-500">{listing.match.round}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold">{listing.category}</div>
                      <div className="text-xs text-slate-500">Qty: {listing.quantity} | Sec: {listing.section || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div className={`font-bold ${listing.pricePerTicket > 5000 ? 'text-red-600' : 'text-brand-navy'}`}>
                        ${listing.pricePerTicket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          listing.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                          listing.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {listing.status}
                        </span>
                        {flags.map(f => (
                          <span key={f} className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-sm">
                            <FileWarning className="w-3 h-3" /> {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {listing.status === 'ACTIVE' ? (
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Reject/Cancel Listing">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 bg-slate-100 hover:bg-green-100 text-slate-400 hover:text-green-600 rounded-lg transition-colors" title="Approve/Reactivate Listing">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
