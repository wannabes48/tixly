'use client';
import * as React from "react";
import { ChevronDown, ChevronUp, ShieldCheck, Mail, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TicketListing {
  id: string;
  category: string;
  section: string | null;
  row: string | null;
  quantity: number;
  pricePerTicket: any;
  deliveryMethod: string;
  sellerId: string | null;
}

export function MatchListingsTable({ listings }: { listings: TicketListing[] }) {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

  const categories = ['All', 'Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'Accessibility'];

  const filteredListings = React.useMemo(() => {
    let sorted = [...listings].sort((a, b) => Number(a.pricePerTicket) - Number(b.pricePerTicket));
    if (selectedCategory !== 'All') {
      const catNorm = selectedCategory.replace('Cat ', 'CAT').toUpperCase();
      sorted = sorted.filter(l => l.category.toUpperCase() === catNorm);
    }
    return sorted;
  }, [listings, selectedCategory]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Mock seller generator based on ID
  const getSellerInfo = (id: string | null) => {
    const defaultInfo = { rating: '4.8', sales: 12, name: 'Verified Fan' };
    if (!id) return defaultInfo;
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const ratings = ['4.5', '4.7', '4.8', '4.9', '5.0'];
    return {
      rating: ratings[hash % ratings.length],
      sales: (hash % 150) + 5,
      name: hash % 2 === 0 ? 'Verified Pro Seller' : 'Verified Fan'
    };
  };

  const getCategoryColor = (cat: string) => {
    const c = cat.toUpperCase();
    if (c === 'CAT 1' || c === 'CAT1') return 'bg-purple-100 text-purple-800 border-purple-200';
    if (c === 'CAT 2' || c === 'CAT2') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (c === 'CAT 3' || c === 'CAT3') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (c === 'CAT 4' || c === 'CAT4') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-pink-100 text-pink-800 border-pink-200'; // Accessibility or other
  };

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-16 text-center">
        <h3 className="text-lg font-bold text-brand-navy mb-2">No tickets available yet</h3>
        <p className="text-gray-500 text-sm">Check back soon or browse other matches.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto hide-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200 border shadow-sm ${
              selectedCategory === cat
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-midblue hover:text-brand-navy'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-200">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Category</th>
                <th className="px-5 py-4 whitespace-nowrap">Section</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Qty</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Price</th>
                <th className="px-5 py-4 whitespace-nowrap text-right hidden md:table-cell">Total</th>
                <th className="px-5 py-4 whitespace-nowrap text-center hidden lg:table-cell">Seller</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    No tickets found in this category.
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => {
                  const price = Number(listing.pricePerTicket);
                  const total = price * listing.quantity;
                  const isExpanded = expandedRows[listing.id];
                  const seller = getSellerInfo(listing.sellerId);

                  return (
                    <React.Fragment key={listing.id}>
                      <tr 
                        className={`hover:bg-brand-paleblue/30 cursor-pointer transition-colors ${isExpanded ? 'bg-brand-paleblue/30' : ''}`}
                        onClick={() => toggleRow(listing.id)}
                      >
                        <td className="px-5 py-5 whitespace-nowrap">
                          <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold border ${getCategoryColor(listing.category)}`}>
                            {listing.category}
                          </span>
                        </td>
                        <td className="px-5 py-5 font-bold text-brand-navy whitespace-nowrap text-base">
                          {listing.section || 'General'}
                          {listing.row && <span className="text-gray-400 font-medium text-sm ml-2">Row {listing.row}</span>}
                        </td>
                        <td className="px-5 py-5 text-center whitespace-nowrap font-bold text-brand-navy">
                          <span className="bg-gray-100 px-2.5 py-1 rounded-md">{listing.quantity}</span>
                        </td>
                        <td className="px-5 py-5 text-right whitespace-nowrap">
                          <div className="font-black text-brand-navy text-lg">${price}</div>
                        </td>
                        <td className="px-5 py-5 text-right whitespace-nowrap hidden md:table-cell text-gray-400 font-semibold text-sm">
                          ${total}
                        </td>
                        <td className="px-5 py-5 text-center hidden lg:table-cell whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-xs">
                            <span className="text-amber-500 text-sm">★</span>
                            <span className="font-bold text-brand-navy">{seller.rating}</span>
                          </div>
                        </td>
                        <td className="px-5 py-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-4">
                            <Button className="bg-brand-orange hover:bg-orange-600 text-white rounded-xl shadow-sm text-sm font-bold px-6 h-10 transition-transform active:scale-95" onClick={(e) => { e.stopPropagation(); window.location.href = `/checkout/${listing.id}`; }}>
                              Buy <ArrowRight size={14} className="ml-1.5" />
                            </Button>
                            {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-50/50 border-t-0">
                          <td colSpan={7} className="p-0">
                            <div className="px-6 py-5 border-l-4 border-brand-orange ml-5 my-3 mr-5 bg-white rounded-r-2xl shadow-sm border-y border-r border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                              {/* Seat Desc */}
                              <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Seat Details</h4>
                                <p className="text-sm font-bold text-brand-navy">
                                  {listing.category} • Section {listing.section || 'General'} • Row {listing.row || 'Any'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">Seats are guaranteed to be together side-by-side.</p>
                              </div>
                              {/* Delivery */}
                              <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Delivery</h4>
                                <div className="flex items-start gap-2.5">
                                  {listing.deliveryMethod.includes('MOBILE') ? (
                                    <Smartphone size={18} className="text-brand-midblue mt-0.5" />
                                  ) : (
                                    <Mail size={18} className="text-brand-midblue mt-0.5" />
                                  )}
                                  <div>
                                    <p className="text-sm font-bold text-brand-navy">
                                      {listing.deliveryMethod.replace('_', ' ')}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">Tickets arrive safely via official transfer 3 days before match.</p>
                                  </div>
                                </div>
                              </div>
                              {/* Seller */}
                              <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Seller Info</h4>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <ShieldCheck size={18} className="text-green-600" />
                                  <span className="text-sm font-bold text-brand-navy">{seller.name}</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{seller.sales} successful sales. 100% Buyer Guarantee.</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
