import React from 'react';
import { DollarSign, Clock, Banknote, ShieldAlert } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seller Payouts | Tixly',
  description: 'Learn when and how you will receive your payout for selling World Cup 2026 tickets on Tixly.',
};

export default function SellerPayoutsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-content mx-auto px-4">
        
        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-600 rounded-2xl mb-6">
            <DollarSign className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-brand-navy mb-4">Seller Payouts</h1>
          <p className="text-gray-600 text-lg">
            A transparent breakdown of how and when you get paid for your ticket sales.
          </p>
        </div>

        {/* Info Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="w-14 h-14 bg-brand-paleblue text-brand-midblue rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-brand-navy mb-3">Payout Timeline</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To ensure a safe marketplace, all payouts are processed <strong>5-8 business days after the match takes place</strong>. This confirms the buyer successfully attended the event.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Banknote className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-brand-navy mb-3">Payment Methods</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              You can receive your payout via Direct Deposit (ACH), PayPal, or Wire Transfer. Make sure to set your default payout method in your Seller Dashboard.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="w-14 h-14 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-brand-navy mb-3">Tax Requirements</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              For US sellers exceeding $600 in gross sales, we are required by the IRS to collect your Taxpayer Identification Number (TIN) and issue a 1099-K.
            </p>
          </div>

        </div>

        {/* Detailed Timeline Table */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-brand-navy">The Payout Process</h2>
          </div>
          <div className="p-8">
            <div className="relative border-l-2 border-gray-100 pl-8 space-y-10 ml-4">
              
              <div className="relative">
                <div className="absolute -left-[41px] bg-white border-2 border-brand-orange w-5 h-5 rounded-full mt-1.5"></div>
                <h4 className="font-bold text-brand-navy mb-1">Tickets Sold</h4>
                <p className="text-gray-600 text-sm">Your tickets are purchased. The buyer's payment is held securely in our escrow account.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[41px] bg-white border-2 border-brand-orange w-5 h-5 rounded-full mt-1.5"></div>
                <h4 className="font-bold text-brand-navy mb-1">Tickets Transferred</h4>
                <p className="text-gray-600 text-sm">You transfer the mobile tickets to the buyer once they are released by FIFA. You must confirm the transfer in your dashboard.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[41px] bg-white border-2 border-brand-orange w-5 h-5 rounded-full mt-1.5"></div>
                <h4 className="font-bold text-brand-navy mb-1">Match Day</h4>
                <p className="text-gray-600 text-sm">The event takes place. The buyer uses the tickets to attend the match.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[41px] bg-brand-orange border-2 border-brand-orange w-5 h-5 rounded-full mt-1.5"></div>
                <h4 className="font-bold text-brand-navy mb-1">Payout Initiated (5-8 Business Days Post-Match)</h4>
                <p className="text-gray-600 text-sm">Your funds are released. Depending on your bank, it may take 1-3 additional days to appear in your account.</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
