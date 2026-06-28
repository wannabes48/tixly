'use client';

import React, { useState, useTransition } from 'react';
import { Search, MapPin, Calendar, Clock, Edit2, PlusCircle, Save, X } from 'lucide-react';
import { LocalTime } from '@/components/LocalTime';
import { updateKickoffTime, addPlatformInventory } from './actions';

export function MatchesClient({ initialMatches }: { initialMatches: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  const [editingKickoffId, setEditingKickoffId] = useState<string | null>(null);
  const [newKickoffTime, setNewKickoffTime] = useState('');

  const [addingInventoryId, setAddingInventoryId] = useState<string | null>(null);
  const [inventoryForm, setInventoryForm] = useState({ category: 'CAT1', quantity: 1, pricePerTicket: 1000 });

  const filteredMatches = initialMatches.filter(match => 
    match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.stadium.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-6 border-b border-slate-100 bg-white">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams or stadiums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
          />
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {filteredMatches.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No matches found.</div>
        ) : (
          filteredMatches.map(match => (
            <div key={match.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      Match {match.matchNumber} &bull; {match.round}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-3">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {match.stadium.name}, {match.stadium.city}
                    </div>
                    
                    {editingKickoffId === match.id ? (
                      <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
                        <input 
                          type="datetime-local" 
                          value={newKickoffTime}
                          onChange={(e) => setNewKickoffTime(e.target.value)}
                          className="px-2 py-1 outline-none text-sm"
                        />
                        <button 
                          onClick={() => {
                            if (!newKickoffTime) return;
                            startTransition(async () => {
                              await updateKickoffTime(match.id, new Date(newKickoffTime).toISOString());
                              setEditingKickoffId(null);
                            });
                          }}
                          disabled={isPending}
                          className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-md transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingKickoffId(null)}
                          className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => {
                        setEditingKickoffId(match.id);
                        // Convert to local format for datetime-local input
                        const dt = new Date(match.kickoffUtc);
                        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
                        setNewKickoffTime(dt.toISOString().slice(0, 16));
                      }}>
                        <Clock className="w-4 h-4" />
                        <LocalTime date={match.kickoffUtc.toISOString()} format="date" /> at <LocalTime date={match.kickoffUtc.toISOString()} format="time" />
                        <Edit2 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-100 rounded-xl p-4 inline-block">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform Inventory (VIP)</div>
                    {match.listings.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {match.listings.map((l: any) => (
                          <div key={l.id} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-navy">
                            {l.category} &bull; {l.quantity} left @ ${l.pricePerTicket}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500 italic">No platform inventory assigned.</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[250px]">
                  {addingInventoryId === match.id ? (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in fade-in zoom-in-95">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-bold text-sm text-brand-navy">Add VIP Inventory</div>
                        <button onClick={() => setAddingInventoryId(null)}><X className="w-4 h-4 text-slate-400 hover:text-slate-600"/></button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Category</label>
                          <select 
                            value={inventoryForm.category}
                            onChange={e => setInventoryForm({ ...inventoryForm, category: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none"
                          >
                            <option value="CAT1">CAT 1</option>
                            <option value="CAT2">CAT 2</option>
                            <option value="CAT3">CAT 3</option>
                            <option value="HOSPITALITY">HOSPITALITY</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Qty</label>
                            <input 
                              type="number" min="1"
                              value={inventoryForm.quantity}
                              onChange={e => setInventoryForm({ ...inventoryForm, quantity: parseInt(e.target.value) || 0 })}
                              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Price</label>
                            <input 
                              type="number" min="1"
                              value={inventoryForm.pricePerTicket}
                              onChange={e => setInventoryForm({ ...inventoryForm, pricePerTicket: parseInt(e.target.value) || 0 })}
                              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            startTransition(async () => {
                              await addPlatformInventory(match.id, inventoryForm.category, inventoryForm.quantity, inventoryForm.pricePerTicket);
                              setAddingInventoryId(null);
                            });
                          }}
                          disabled={isPending || inventoryForm.quantity < 1 || inventoryForm.pricePerTicket < 1}
                          className="w-full bg-brand-navy hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          Save Inventory
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setAddingInventoryId(match.id)}
                      className="flex items-center justify-center gap-2 w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                    >
                      <PlusCircle className="w-5 h-5" /> Add VIP Tickets
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">
                    Manage Match Settings
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
