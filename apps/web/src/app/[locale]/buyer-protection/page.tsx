import { ShieldCheck, Lock, TicketCheck, Headset, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function BuyerProtectionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-brand-navy text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <ShieldCheck className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange px-4 py-2 rounded-full font-semibold mb-6">
              <ShieldCheck className="w-5 h-5" />
              100% Tixly Guarantee
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              Your Peace of Mind is Our Priority.
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
              Every ticket on Tixly is backed by our comprehensive Buyer Protection Guarantee. We verify sellers so you don't have to.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Pillars */}
      <div className="container mx-auto px-4 max-w-6xl py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center mb-6">
              <TicketCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4">Valid Tickets</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              We guarantee your tickets are authentic and valid for entry. If there's an issue at the gate, we'll find you comparable or better replacements, or offer a full refund.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-brand-navy/10 text-brand-navy rounded-xl flex items-center justify-center mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4">Secure Payments</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Your financial information is never shared with sellers. We use industry-leading encryption to ensure your transaction is 100% secure.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4">On-Time Delivery</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              We guarantee your tickets will be delivered in time for the event. For digital tickets, delivery is often instant upon seller transfer.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-brand-navy/10 text-brand-navy rounded-xl flex items-center justify-center mb-6">
              <Headset className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4">24/7 Support</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Our dedicated support team is available around the clock to assist you with any questions before, during, or after the match.
            </p>
          </div>
        </div>

        {/* Cancelled Events Section */}
        <div className="mt-24 bg-brand-navy rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-bold text-white mb-4">What happens if a match is cancelled?</h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              In the rare event that a World Cup 2026 match is cancelled and not rescheduled, you are guaranteed a full refund, including all fees. If a match is postponed, your tickets will automatically be valid for the new date.
            </p>
            <ul className="space-y-4 mt-6">
              <li className="flex items-center text-white text-lg gap-3">
                <CheckCircle2 className="text-brand-orange w-6 h-6 flex-shrink-0" />
                Full refund for cancelled events
              </li>
              <li className="flex items-center text-white text-lg gap-3">
                <CheckCircle2 className="text-brand-orange w-6 h-6 flex-shrink-0" />
                Tickets valid for rescheduled dates
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 relative h-[300px] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1574629810360-7efbb1925846?auto=format&fit=crop&q=80"
              alt="Soccer ball on field"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
