'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface ListingRowProps {
  listing: any;
  matchId: string;
  selectedQty: number;
}

export function ListingRow({ listing, matchId, selectedQty }: ListingRowProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const handleBuy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHolding(true);
    // Optimistic redirect, checkout page will handle validation
    router.push(`/checkout?listingId=${listing.id}&qty=${selectedQty}&matchId=${matchId}`);
  };

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'CAT1': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CAT2': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CAT3': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CAT4': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const total = listing.pricePerTicket * selectedQty;

  return (
    <>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors gap-3 sm:gap-0 ${isExpanded ? 'bg-gray-50' : ''}`}
      >
        <div className="flex items-center gap-3 sm:gap-6 flex-1 w-full">
          <div className={`px-2.5 py-1 rounded-md text-xs font-bold border ${categoryColor(listing.category)} w-14 sm:w-16 shrink-0 text-center`}>
            {listing.category}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-bold text-brand-navy truncate text-sm sm:text-base">{listing.section || 'General Admission'}</div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">{listing.row || 'Row TBD'}</div>
          </div>
          
          <div className="text-right hidden sm:block w-12 sm:w-16 shrink-0">
            <div className="font-bold text-gray-700">{selectedQty}</div>
            <div className="text-xs text-gray-400">Qty</div>
          </div>
          
          <div className="text-right shrink-0">
            <div className="font-bold text-gray-900 text-base sm:text-lg">${listing.pricePerTicket.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Each</div>
          </div>
          
          <div className="w-24 text-right hidden lg:block shrink-0">
            <div className="font-bold text-brand-navy">${total.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto sm:ml-6 pt-3 sm:pt-0 border-t border-gray-100 sm:border-0">
          <div className="sm:hidden text-sm flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">Total:</span>
            <span className="font-bold text-brand-navy">${total.toLocaleString()}</span>
            <span className="text-gray-400 text-xs">({selectedQty}x)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBuy}
              disabled={isHolding}
              className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-sm disabled:opacity-50 text-sm sm:text-base"
            >
              {isHolding ? 'Holding...' : 'Buy'}
            </button>
            <div className="text-gray-400 w-6 flex justify-center">
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded Accordion Details */}
      {isExpanded && (
        <div className="bg-white p-6 border-b border-gray-200 shadow-inner animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Seller Details</h4>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-brand-paleblue flex items-center justify-center text-brand-navy font-bold text-lg">
                  {listing.seller?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <div className="font-bold text-brand-navy flex items-center gap-1.5">
                    {listing.seller?.name || 'Anonymous User'}
                    {listing.seller?.kycStatus === 'VERIFIED' && (
                      <BadgeCheck size={16} className="text-green-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="text-yellow-500">⭐ {listing.seller?.avgRating || '4.9'}</span>
                    <span>·</span>
                    <span>{listing.seller?.totalSales || '142'} sales</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ticket Delivery</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
                  <Download size={18} />
                </div>
                <div>
                  <div className="font-bold text-brand-navy">
                    {listing.deliveryMethod === 'MOBILE_TRANSFER' ? 'Mobile Transfer' : 'Instant PDF'}
                  </div>
                  <div className="text-sm text-gray-500">Tickets transferred within 72h of match</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
