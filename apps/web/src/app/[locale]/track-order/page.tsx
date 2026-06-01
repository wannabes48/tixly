import React from 'react';
import { PackageSearch, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order | Tixly',
  description: 'Track the status of your World Cup 2026 ticket order. View delivery details and transfer instructions.',
};

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-content mx-auto px-4">
        
        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-black text-brand-navy mb-4">Track Your Order</h1>
          <p className="text-gray-600 text-lg">
            Enter your order details below to view your ticket status, transfer instructions, and delivery timeline.
          </p>
        </div>

        {/* Tracking Card */}
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden mb-16">
          <div className="p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="orderId" className="block text-sm font-bold text-gray-700 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  placeholder="e.g. TXL-123456789"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="The email used at checkout"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>

              <button
                type="button"
                className="w-full bg-brand-navy hover:bg-[#112942] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-md"
              >
                <PackageSearch className="w-5 h-5" />
                Find My Order
              </button>
            </form>
          </div>
          
          <div className="bg-brand-paleblue/30 p-6 border-t border-gray-100 flex items-start gap-4">
            <div className="bg-brand-paleblue p-2 rounded-full text-brand-midblue shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-brand-navy text-sm mb-1">100% Buyer Guarantee</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your tickets will be delivered in time for the event. All tickets are protected by our money-back guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-3 rounded-lg text-gray-600">
              <PackageSearch className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">When will I receive my tickets?</h3>
              <p className="text-sm text-gray-600">
                FIFA traditionally releases mobile tickets 2-4 weeks before the tournament begins. Your seller will transfer them to you as soon as they become available in the official ticketing app.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-100 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-3 rounded-lg text-gray-600">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Need help with an order?</h3>
              <p className="text-sm text-gray-600 mb-3">
                If your event is less than 48 hours away and you haven't received transfer instructions, please contact our emergency support team.
              </p>
              <a href="#" className="text-brand-orange font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Contact Support <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
