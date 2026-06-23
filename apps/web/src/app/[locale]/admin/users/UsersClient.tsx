'use client';

import React, { useState } from 'react';
import { Search, Clock, ShieldAlert, CheckCircle2, XCircle, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

type AccountData = {
  provider: string;
};

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  kycStatus: string;
  isSuspended: boolean;
  isBanned: boolean;
  accounts: AccountData[];
};

type HoldData = {
  id: string;
  sessionId: string;
  buyerFirstName: string | null;
  buyerLastName: string | null;
  buyerEmail: string | null;
  buyerPhone: string | null;
  quantity: number;
  expiresAt: string;
  createdAt: string;
  listing: {
    match: {
      homeTeam: { name: string; flagUrl: string | null };
      awayTeam: { name: string; flagUrl: string | null };
    };
    category: string;
    pricePerTicket: number;
  };
};

interface UsersClientProps {
  users: UserData[];
  holds: HoldData[];
}

export default function UsersClient({ users, holds }: UsersClientProps) {
  const [activeTab, setActiveTab] = useState<'USERS' | 'HOLDS'>('USERS');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter holds based on search
  const filteredHolds = holds.filter(hold => 
    hold.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hold.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hold.buyerEmail?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (hold.buyerFirstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    hold.listing.match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hold.listing.match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'VERIFIED': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Verified</span>;
      case 'PENDING': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>;
      case 'UNVERIFIED': return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Unverified</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
      
      {/* Header & Tabs */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl">
          <button 
            onClick={() => setActiveTab('USERS')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'USERS' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Registered Users ({users.length})
          </button>
          <button 
            onClick={() => setActiveTab('HOLDS')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'HOLDS' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Active Ticket Holds ({holds.length})
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={activeTab === 'USERS' ? "Search users by name, email..." : "Search holds by ID, email, team..."}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="overflow-x-auto flex-1">
        {activeTab === 'USERS' && (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">KYC Status</th>
                <th className="px-6 py-4">Providers</th>
                <th className="px-6 py-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found.</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-brand-navy">{user.name || 'Unnamed User'}</div>
                        <div className="text-xs text-slate-500">{user.email || 'No email provided'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{user.role}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.kycStatus)}</td>
                  <td className="px-6 py-4">
                    {user.accounts.length > 0 
                      ? user.accounts.map(a => a.provider).join(', ') 
                      : 'Credentials / Guest'}
                  </td>
                  <td className="px-6 py-4">
                    {user.isBanned ? (
                      <span className="flex items-center gap-1 text-red-600 font-semibold text-xs"><XCircle className="w-4 h-4"/> Banned</span>
                    ) : user.isSuspended ? (
                      <span className="flex items-center gap-1 text-yellow-600 font-semibold text-xs"><ShieldAlert className="w-4 h-4"/> Suspended</span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 font-semibold text-xs"><CheckCircle2 className="w-4 h-4"/> Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'HOLDS' && (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Match & Category</th>
                <th className="px-6 py-4">Hold Timeline</th>
                <th className="px-6 py-4">Quantity / Price</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHolds.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No active holds found.</td></tr>
              ) : filteredHolds.map((hold) => {
                const isExpired = new Date(hold.expiresAt).getTime() < Date.now();
                
                return (
                  <tr key={hold.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {hold.buyerFirstName || hold.buyerEmail ? (
                        <>
                          <div className="font-semibold text-brand-navy">
                            {hold.buyerFirstName} {hold.buyerLastName}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{hold.buyerEmail}</div>
                          {hold.buyerPhone && (
                            <div className="text-xs text-slate-500 mt-0.5">{hold.buyerPhone}</div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="font-semibold text-slate-400 italic">Anonymous Guest</div>
                          <div className="text-xs text-slate-400 mt-0.5 font-mono" title="Session ID">{hold.sessionId.substring(0, 16)}...</div>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-brand-navy">
                        {hold.listing.match.homeTeam.name} vs {hold.listing.match.awayTeam.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{hold.listing.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500">Created: {format(new Date(hold.createdAt), 'MMM dd, HH:mm:ss')}</div>
                      <div className="text-xs text-slate-500">Expires: {format(new Date(hold.expiresAt), 'MMM dd, HH:mm:ss')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-brand-navy">{hold.quantity} Tickets</div>
                      <div className="text-xs text-slate-500">${hold.listing.pricePerTicket} ea</div>
                    </td>
                    <td className="px-6 py-4">
                      {isExpired ? (
                         <span className="flex items-center gap-1 text-slate-500 font-semibold text-xs bg-slate-100 px-2 py-1 rounded-full w-max"><Clock className="w-3.5 h-3.5"/> Expired</span>
                      ) : (
                         <span className="flex items-center gap-1 text-brand-orange font-semibold text-xs bg-orange-50 border border-orange-100 px-2 py-1 rounded-full w-max"><Clock className="w-3.5 h-3.5"/> Active Hold</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
