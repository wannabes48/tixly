'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { ListingRow } from './ListingRow';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

interface ListingsTableProps {
  matchId: string;
  initialQuantity: number;
}

export function ListingsTable({ matchId, initialQuantity }: ListingsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [quantity, setQuantity] = useState(initialQuantity);
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState('price_asc');
  
  const [listings, setListings] = useState<any[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const qtyParam = searchParams.get('quantity');
    if (qtyParam) setQuantity(parseInt(qtyParam));
  }, [searchParams]);

  // Fetch listings from API whenever filters change
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/matches/${matchId}/listings?quantity=${quantity}&category=${activeTab}`);
        const data = await res.json();
        setListings(data.listings || []);
        setCategoryCounts(data.categoryCounts || {});
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, [matchId, quantity, activeTab]);

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1 || newQty > 4) return;
    setQuantity(newQty);
    // Persist quantity to URL without page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('quantity', newQty.toString());
    router.replace(`/matches/${matchId}?${params.toString()}`, { scroll: false });
  };

  const tabs = ['All', 'CAT1', 'CAT2', 'CAT3', 'CAT4', 'ACCESSIBILITY'];
  const getTabLabel = (tab: string) => {
    if (tab === 'All') return 'All';
    if (tab === 'ACCESSIBILITY') return 'Accessibility';
    return `Cat ${tab.replace('CAT', '')}`;
  };

  const sortedListings = [...listings].sort((a, b) => {
    if (sortBy === 'price_asc') return a.pricePerTicket - b.pricePerTicket;
    if (sortBy === 'price_desc') return b.pricePerTicket - a.pricePerTicket;
    if (sortBy === 'qty_desc') return b.quantity - a.quantity;
    return 0;
  });

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
      
      {/* Category Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100 bg-gray-50/50">
        {tabs.map(tab => {
          const count = tab === 'All' 
            ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
            : categoryCounts[tab] || 0;
            
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] py-4 px-2 text-center border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-tixNavy text-tixNavy font-bold bg-white' 
                  : 'border-transparent text-gray-500 hover:text-tixNavy hover:bg-gray-100'
              }`}
            >
              <div className="text-sm">{getTabLabel(tab)}</div>
              <div className="text-xs font-normal opacity-70 mt-0.5">{count} {count === 1 ? 'ticket' : 'tickets'}</div>
            </button>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-100 bg-white gap-4">
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-500 whitespace-nowrap">Sort by:</label>
          <Select value={sortBy} onValueChange={(val: string) => setSortBy(val)}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200 text-tixNavy font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="qty_desc">Quantity: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-700">Qty:</span>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <button 
              onClick={() => handleQtyChange(quantity - 1)}
              disabled={quantity <= 1}
              className="px-3 py-1.5 hover:bg-gray-200 disabled:opacity-50 text-gray-700 transition-colors"
            >
              −
            </button>
            <div className="px-4 py-1.5 font-bold text-tixNavy bg-white border-x border-gray-200 w-12 text-center">
              {quantity}
            </div>
            <button 
              onClick={() => handleQtyChange(quantity + 1)}
              disabled={quantity >= 4}
              className="px-3 py-1.5 hover:bg-gray-200 disabled:opacity-50 text-gray-700 transition-colors"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 font-medium">
          Showing {sortedListings.length} listings
        </div>
        
      </div>

      {/* Listings List */}
      <div className="flex-1 bg-white relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-tixOrange w-8 h-8" />
          </div>
        )}
        
        {sortedListings.length === 0 && !isLoading ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4 opacity-50">🎫</div>
            <h3 className="text-xl font-bold text-tixNavy mb-2">No tickets found</h3>
            <p className="text-gray-500">We couldn't find any tickets for this category and quantity.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {sortedListings.map((listing) => (
              <ListingRow 
                key={listing.id} 
                listing={listing} 
                matchId={matchId} 
                selectedQty={quantity} 
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
