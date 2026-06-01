import React from 'react';
import { HelpCircle, FileText, Settings, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seller FAQ | Tixly',
  description: 'Frequently asked questions for Tixly sellers. Learn how to list, manage, and transfer your World Cup tickets.',
};

export default function SellerFaqPage() {
  const faqs = [
    {
      q: "How do I list my World Cup tickets?",
      a: "Click 'Sell Tickets' in the navigation bar. You'll need to specify the match, seating category, and your asking price. You will also need to verify your ticket details by uploading proof of purchase or transferring the tickets to our secure holding account once they are released by FIFA."
    },
    {
      q: "When can I transfer the tickets to the buyer?",
      a: "FIFA typically releases digital tickets to the official app 2-4 weeks before the tournament. Once the tickets are active in your account, you will receive an email from us with instructions to transfer them to the buyer's email address."
    },
    {
      q: "What fees does Tixly charge sellers?",
      a: "Listing your tickets is completely free. We only charge a 10% seller fee once your tickets are sold. This fee is automatically deducted from your final payout."
    },
    {
      q: "Can I adjust my ticket price after listing?",
      a: "Yes, you can edit your listing price or remove your listing at any time from your Seller Dashboard, provided the tickets have not yet been purchased by a buyer."
    },
    {
      q: "What happens if a match is cancelled or rescheduled?",
      a: "If a match is cancelled and not rescheduled, buyers are fully refunded and you will not receive a payout. If a match is rescheduled, the tickets remain valid for the new date and the sale stands."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-content mx-auto px-4">
        
        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-brand-orange/10 text-brand-orange rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-brand-navy mb-4">Seller FAQ</h1>
          <p className="text-gray-600 text-lg">
            Everything you need to know about selling your World Cup 2026 tickets safely and securely on Tixly.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-brand-navy mb-3">{faq.q}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Support Callout */}
        <div className="max-w-3xl mx-auto mt-16 bg-brand-navy rounded-2xl p-8 sm:p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
          
          <h3 className="text-2xl font-bold mb-4 relative z-10">Still have questions?</h3>
          <p className="text-white/70 mb-8 max-w-lg mx-auto relative z-10">
            Our dedicated seller support team is available 24/7 to help you with your listings, transfers, or account issues.
          </p>
          <button className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all relative z-10">
            Contact Seller Support
          </button>
        </div>

      </div>
    </main>
  );
}
