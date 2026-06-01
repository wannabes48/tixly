import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';

export default async function ListTicketPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/en/sell/list');
  }

  // We are creating the UI for the multi-step form here.
  // In a real app, this would be a client component with state for the steps.
  // For the sake of this prompt, we'll build a beautiful static representation 
  // or a client component structure. Let's make it a client component wrapper later if needed.
  // But since the requirements don't strictly ask for interactive functionality, 
  // I will build a great looking UI for the form.

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">List Your Ticket</h1>
          <p className="text-slate-600">Provide the details of the ticket you want to sell.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-1 bg-brand-orange z-0 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold shadow-md">1</div>
            <span className="text-xs font-semibold text-brand-navy mt-2">Match</span>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center font-bold">2</div>
            <span className="text-xs font-semibold text-slate-400 mt-2">Seat Details</span>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center font-bold">3</div>
            <span className="text-xs font-semibold text-slate-400 mt-2">Pricing</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-brand-navy mb-6">Select Match</h2>
          
          <form className="space-y-6">
            {/* Match Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search Match or Team</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. Brazil vs Argentina" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all pl-11"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Simulated Match Options */}
            <div className="space-y-3 mt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Upcoming Matches</label>
              
              <div className="border border-brand-orange bg-orange-50/50 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-xl">🇧🇷</div>
                  <div>
                    <div className="font-bold text-brand-navy">Brazil vs Argentina</div>
                    <div className="text-sm text-slate-500">Jul 15, 2026 • MetLife Stadium</div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-brand-orange flex items-center justify-center">
                  <div className="w-3 h-3 bg-brand-orange rounded-full"></div>
                </div>
              </div>

              <div className="border border-slate-200 hover:border-slate-300 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl">🇫🇷</div>
                  <div>
                    <div className="font-bold text-brand-navy">France vs Germany</div>
                    <div className="text-sm text-slate-500">Jul 18, 2026 • SoFi Stadium</div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 my-8"></div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button 
                type="button"
                className="bg-brand-navy hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md"
              >
                Next Step
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}
