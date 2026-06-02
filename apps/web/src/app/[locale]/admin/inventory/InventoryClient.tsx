'use client';

import React, { useState } from 'react';
import { Search, Edit3, PlusCircle, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { LocalTime } from '@/components/LocalTime';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InventoryClient({ initialMatches }: { initialMatches: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [allocatingMatch, setAllocatingMatch] = useState<string | null>(null);

  const filteredMatches = initialMatches.filter(match => {
    const searchString = `${match.homeTeam.name} ${match.awayTeam.name} ${match.stadium.name} ${match.round}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="p-6 border-b border-slate-100 bg-white">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams, stadiums, or rounds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
              <th className="p-4 font-semibold">Match</th>
              <th className="p-4 font-semibold">Stadium</th>
              <th className="p-4 font-semibold">Kickoff (UTC)</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No matches found.
                </td>
              </tr>
            ) : (
              filteredMatches.map(match => (
                <tr key={match.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-brand-navy">
                      {match.homeTeam.name} vs {match.awayTeam.name}
                    </div>
                    <div className="text-xs text-slate-500">{match.round} &bull; Match {match.matchNumber}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className="font-semibold text-brand-navy">{match.stadium.name}</div>
                    <div className="text-xs text-slate-500">{match.stadium.city}</div>
                  </td>
                  <td className="p-4 text-sm">
                    {editingMatch === match.id ? (
                      <div className="flex gap-2">
                        <input type="datetime-local" className="border border-slate-200 rounded-lg px-2 py-1 text-xs" />
                        <button onClick={() => setEditingMatch(null)} className="text-green-600"><Save className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <div className="text-slate-600">
                        {format(new Date(match.kickoffUtc), 'MMM d, yyyy HH:mm')} UTC
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      match.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {match.status}
                    </span>
                    <div className="text-xs text-slate-500 mt-1">{match._count.listings} active listings</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingMatch(match.id)}
                        className="p-1.5 bg-slate-100 hover:bg-brand-navy hover:text-white text-slate-400 rounded-lg transition-colors" 
                        title="Edit Kickoff Time"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setAllocatingMatch(match.id)}
                        className="p-1.5 bg-orange-50 hover:bg-brand-orange hover:text-white text-brand-orange rounded-lg transition-colors" 
                        title="Add Admin Allocation"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {allocatingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={() => setAllocatingMatch(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brand-navy">Inject Admin Inventory</h3>
              <button onClick={() => setAllocatingMatch(null)} className="text-slate-400 hover:text-brand-navy"><X className="w-5 h-5"/></button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setAllocatingMatch(null); }}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <Select defaultValue="CAT1">
                  <SelectTrigger className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-tixOrange outline-none text-left">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAT1">CAT1</SelectItem>
                    <SelectItem value="CAT2">CAT2</SelectItem>
                    <SelectItem value="CAT3">CAT3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Quantity</label>
                  <input type="number" defaultValue={10} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-tixOrange outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Price per Ticket (USD)</label>
                  <input type="number" defaultValue={250} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-tixOrange outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Internal Note / Allocation ID</label>
                <input type="text" placeholder="e.g. VIP-ALLOCATION-A" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-tixOrange outline-none" />
              </div>
              <button type="submit" className="w-full bg-tixOrange hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors mt-2">
                List Tickets to Marketplace
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
