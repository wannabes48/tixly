'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, MoreVertical, X, Check, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { LocalTime } from '@/components/LocalTime';

export function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const filteredOrders = initialOrders.filter(order => {
    const matchesSearch = 
      order.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-orange-100 text-orange-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'REFUNDED': return 'bg-slate-100 text-slate-700';
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
            placeholder="Search reference or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['ALL', 'PAID', 'PENDING', 'CANCELLED', 'REFUNDED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status 
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
              <th className="p-4 font-semibold">Reference</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Buyer Email</th>
              <th className="p-4 font-semibold">Match</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No orders found matching your filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-sm text-brand-navy font-semibold">{order.reference}</td>
                  <td className="p-4 text-sm text-slate-600">
                    <LocalTime date={order.createdAt.toISOString()} format="date" />
                  </td>
                  <td className="p-4 text-sm text-slate-600">{order.buyerEmail}</td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-brand-navy truncate max-w-[200px]">
                      {order.listing.match.homeTeam.countryCode} vs {order.listing.match.awayTeam.countryCode}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-brand-navy">${order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors inline-flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-brand-navy">Order {selectedOrder.reference}</h2>
                <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  &bull; Created <LocalTime date={selectedOrder.createdAt.toISOString()} format="date" />
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              
              {/* 3 Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Buyer Info */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand-orange" />
                    Buyer Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-slate-500 mb-0.5">Name</div>
                      <div className="font-semibold text-brand-navy">{selectedOrder.buyerName}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-0.5">Email</div>
                      <div className="font-semibold text-brand-navy break-all">{selectedOrder.buyerEmail}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-0.5">Phone</div>
                      <div className="font-semibold text-brand-navy">{selectedOrder.buyerPhone || 'Not provided'}</div>
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand-midblue" />
                    Seller Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    {selectedOrder.listing.seller ? (
                      <>
                        <div>
                          <div className="text-slate-500 mb-0.5">Name</div>
                          <div className="font-semibold text-brand-navy">{selectedOrder.listing.seller.name || 'Anonymous'}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 mb-0.5">Email</div>
                          <div className="font-semibold text-brand-navy break-all">{selectedOrder.listing.seller.email}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 mb-0.5">KYC Status</div>
                          <div className="font-semibold text-brand-navy">{selectedOrder.listing.seller.kycStatus}</div>
                        </div>
                      </>
                    ) : (
                      <div className="text-slate-500 italic py-4">Platform / Admin Inventory</div>
                    )}
                  </div>
                </div>

                {/* Financials */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-500" />
                    Financials
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <div className="text-slate-500">Subtotal</div>
                      <div className="font-semibold text-brand-navy">${selectedOrder.subtotal.toFixed(2)}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-slate-500">Service Fee</div>
                      <div className="font-semibold text-brand-navy">${selectedOrder.serviceFee.toFixed(2)}</div>
                    </div>
                    {selectedOrder.refundProtection && (
                      <div className="flex justify-between">
                        <div className="text-slate-500">Protection</div>
                        <div className="font-semibold text-brand-navy">Included</div>
                      </div>
                    )}
                    <div className="h-px bg-slate-200 my-2"></div>
                    <div className="flex justify-between text-base">
                      <div className="font-bold text-brand-navy">Total Paid</div>
                      <div className="font-black text-brand-navy">${selectedOrder.total.toFixed(2)} {selectedOrder.currency}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Match Card */}
              <div>
                <h3 className="font-bold text-brand-navy mb-4">Ticket Breakdown</h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 p-4 border-b border-slate-200">
                    <div className="font-bold text-brand-navy text-lg">
                      {selectedOrder.listing.match.homeTeam.name} vs {selectedOrder.listing.match.awayTeam.name}
                    </div>
                    <div className="text-slate-500 text-sm">
                      {selectedOrder.listing.match.stadium.name}, {selectedOrder.listing.match.stadium.city} &bull; <LocalTime date={selectedOrder.listing.match.kickoffUtc.toISOString()} format="date" />
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white">
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Category</div>
                      <div className="font-semibold text-brand-navy">{selectedOrder.listing.category}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Quantity</div>
                      <div className="font-semibold text-brand-navy">{selectedOrder.quantity} Tickets</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Section/Row</div>
                      <div className="font-semibold text-brand-navy">{selectedOrder.listing.section || 'TBD'} / {selectedOrder.listing.row || 'TBD'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Payment Intent</div>
                      <div className="font-mono text-xs font-semibold text-slate-600 break-all">{selectedOrder.stripePaymentIntentId || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div>
                <h3 className="font-bold text-brand-navy mb-4">Admin Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-5 rounded-xl transition-colors border border-red-200 flex items-center gap-2">
                    <X className="w-4 h-4" /> Issue Refund
                  </button>
                  <button className="bg-green-50 hover:bg-green-100 text-green-600 font-bold py-2.5 px-5 rounded-xl transition-colors border border-green-200 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Mark Delivered
                  </button>
                  <button className="bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold py-2.5 px-5 rounded-xl transition-colors border border-orange-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Open Dispute
                  </button>
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-xl transition-colors border border-slate-200">
                    Add Internal Note
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
