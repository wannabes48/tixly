import { ShieldCheck, Search, CreditCard, Tag, Users, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from '@/navigation';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-brand-navy mb-6 tracking-tight">
            How Tixly Works
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your trusted marketplace for World Cup 2026 tickets. Whether you're looking to buy seats to the final or sell your extra tickets, we make it simple and secure.
          </p>
        </div>

        {/* For Buyers */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-4xl font-bold text-brand-navy">For Buyers</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-brand-orange to-transparent opacity-30 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80"
                alt="Excited fans at a stadium"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-navy/20 mix-blend-multiply" />
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center">
                  <Search className="w-8 h-8 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-2">1. Find Your Match</h3>
                  <p className="text-lg text-slate-600">Browse thousands of verified tickets for every World Cup 2026 match. Filter by venue, date, team, and seating tier.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-2">2. Secure Checkout</h3>
                  <p className="text-lg text-slate-600">Purchase with confidence. All transactions are protected by our 100% Buyer Guarantee and bank-level encryption.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center">
                  <img src="/ticket.png" alt="Ticket" className="w-8 h-8 text-brand-orange object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-2">3. Receive Tickets</h3>
                  <p className="text-lg text-slate-600">Tickets are instantly transferred to your account or delivered securely well before the match kicks off.</p>
                </div>
              </div>
              
              <Link href="/tickets" className="inline-block mt-4">
                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                  Find Tickets <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* For Sellers */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-4xl font-bold text-brand-navy">For Sellers</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-brand-orange to-transparent opacity-30 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center flex-row-reverse md:flex-row">
            <div className="space-y-8 order-2 md:order-1">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-brand-navy/10 flex items-center justify-center">
                  <Tag className="w-8 h-8 text-brand-navy" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-2">1. List Your Tickets</h3>
                  <p className="text-lg text-slate-600">Set your price and upload your ticket details. Our platform helps you price competitively to sell faster.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-brand-navy/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-brand-navy" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-2">2. Reach Global Fans</h3>
                  <p className="text-lg text-slate-600">Your listing instantly reaches millions of passionate soccer fans worldwide actively looking for seats.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-brand-navy/10 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-brand-navy" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-2">3. Get Paid Safely</h3>
                  <p className="text-lg text-slate-600">Once the buyer attends the event, funds are securely transferred to your bank account with no hassle.</p>
                </div>
              </div>

              <Link href="/sell" className="inline-block mt-4">
                <Button variant="outline" className="border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all">
                  Start Selling <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2">
              <Image 
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80"
                alt="Fans celebrating in stadium"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-orange/20 mix-blend-multiply" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
