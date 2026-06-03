import { ShieldCheck, Wallet, TrendingUp, Globe, Headphones, Zap, UserPlus, ListPlus, CreditCard, Truck, ArrowRight, Star, CheckCircle2, Quote } from "lucide-react";
import { Link } from "@/navigation";

export default function SellLandingPage() {
  const stats = [
    { value: "10,000+", label: "Active Sellers" },
    { value: "$2M+", label: "In Payouts" },
    { value: "104", label: "Matches" },
    { value: "4.9★", label: "Seller Rating" },
  ];

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Create Account",
      description: "Sign up and complete quick KYC verification through Stripe Identity.",
    },
    {
      number: "02",
      icon: ListPlus,
      title: "List Your Tickets",
      description: "Select the match, set your price with real-time guidance, and upload proof.",
    },
    {
      number: "03",
      icon: CreditCard,
      title: "Get Paid",
      description: "Buyer pays securely. Money is held in escrow until confirmed.",
    },
    {
      number: "04",
      icon: Truck,
      title: "Deliver Tickets",
      description: "Transfer tickets via PDF, FIFA App, or within 72h. Payout released automatically.",
    },
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Verified Platform",
      description: "KYC-verified sellers with automated fraud prevention.",
      iconBg: "bg-[#1A3C5E]/10 text-[#1A3C5E]",
    },
    {
      icon: Wallet,
      title: "Fast Payouts",
      description: "Direct to your bank via Stripe Connect within 3–5 business days.",
      iconBg: "bg-[#E8532A]/10 text-[#E8532A]",
    },
    {
      icon: TrendingUp,
      title: "Price Guidance",
      description: "Real-time comparable prices to help you maximize value.",
      iconBg: "bg-[#1A3C5E]/10 text-[#1A3C5E]",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Reach verified fans from 200+ countries instantly.",
      iconBg: "bg-[#E8532A]/10 text-[#E8532A]",
    },
    {
      icon: Headphones,
      title: "Seller Support",
      description: "Dedicated 24/7 support for listing, pricing, and payouts.",
      iconBg: "bg-[#1A3C5E]/10 text-[#1A3C5E]",
    },
    {
      icon: Zap,
      title: "Instant Listing",
      description: "Go live in under 2 minutes with our streamlined process.",
      iconBg: "bg-[#E8532A]/10 text-[#E8532A]",
    },
  ];

  const testimonials = [
    {
      quote: "Listed 4 extra USA vs Brazil tickets on Tixly — sold within hours. Payout arrived before the match even started!",
      name: "Marcus R.",
      location: "Los Angeles, USA",
      stars: 5,
    },
    {
      quote: "The price guidance tool helped me sell for 30% more than expected. Seamless and professional.",
      name: "Sofia M.",
      location: "Mexico City, Mexico",
      stars: 5,
    },
    {
      quote: "First-time seller — KYC was quick, support answered all my questions. Highly recommend.",
      name: "James T.",
      location: "Toronto, Canada",
      stars: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D2137] via-[#1A3C5E] to-[#0D2137]" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.03) 30px, rgba(255,255,255,0.03) 32px)" }} />
        <div className="absolute top-16 right-16 w-72 h-72 bg-[#E8532A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-8 left-8 w-64 h-64 bg-[#2F6B9A]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-3xl mx-auto text-center md:text-left md:mx-0">
            <div className="inline-flex items-center gap-1.5 bg-[#E8532A]/20 text-[#E8532A] px-4 py-2 rounded-full font-bold text-xs mb-6 backdrop-blur-sm border border-[#E8532A]/20">
              <Wallet className="w-4 h-4" />
              Seller Portal
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-5 text-white tracking-tight">
              Turn Your Extra Tickets Into{" "}
              <span className="text-[#E8532A]">Cash</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mb-8">
              Join thousands of verified sellers on the most trusted World Cup 2026 marketplace. List in under 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sign-in?callbackUrl=/en/sell/list" className="inline-flex items-center justify-center gap-2 bg-[#E8532A] hover:bg-[#d64a23] text-white font-bold text-sm py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Start Selling Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm py-3.5 px-8 rounded-xl transition-all backdrop-blur-sm">
                Learn How It Works
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-5 py-4 text-center">
                <p className="text-2xl md:text-3xl font-black text-white mb-0.5">{stat.value}</p>
                <p className="text-white/60 text-xs font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="w-10 h-1 bg-[#E8532A] rounded-full mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-black text-[#1A3C5E] mb-2">Sell in 4 Easy Steps</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">From listing to payout — simple, secure, and fast.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-slate-50 rounded-xl border border-slate-100 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-6xl font-black text-[#E8532A]/10 absolute top-3 right-3 select-none leading-none">{step.number}</span>
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#1A3C5E] to-[#2F6B9A] rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-[#1A3C5E] mb-1.5 leading-tight">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-white border border-slate-200 rounded-full items-center justify-center">
                    <ArrowRight className="w-2.5 h-2.5 text-[#E8532A]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sell With Tixly */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="w-10 h-1 bg-[#E8532A] rounded-full mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-black text-[#1A3C5E] mb-2">Why Sell With Tixly</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">The most trusted platform for World Cup 2026 ticket resale.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-11 h-11 ${benefit.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                  <benefit.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1A3C5E] mb-1.5 leading-tight">{benefit.title}</h3>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Fees */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <div className="w-10 h-1 bg-[#E8532A] rounded-full mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-black text-[#1A3C5E] mb-2">Transparent Pricing</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">No surprises. Know exactly what you earn before you list.</p>
          </div>

          <div className="bg-gradient-to-br from-[#0D2137] to-[#1A3C5E] rounded-2xl p-6 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8532A]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#2F6B9A]/15 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <p className="text-5xl md:text-6xl font-black text-[#E8532A] mb-1">$0</p>
                  <p className="text-white/80 font-medium text-sm">Listing Fee</p>
                  <p className="text-white/50 text-xs mt-0.5">Free to list</p>
                </div>
                <div className="text-center">
                  <p className="text-5xl md:text-6xl font-black text-white mb-1">8%</p>
                  <p className="text-white/80 font-medium text-sm">Commission</p>
                  <p className="text-white/50 text-xs mt-0.5">On successful sales</p>
                </div>
                <div className="text-center">
                  <p className="text-5xl md:text-6xl font-black text-white mb-1">$0</p>
                  <p className="text-white/80 font-medium text-sm">Hidden Fees</p>
                  <p className="text-white/50 text-xs mt-0.5">What you see is what you get</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#E8532A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm mb-0.5">Industry-Leading Rates</p>
                    <p className="text-white/70 text-xs">Most competitors charge 10–15% commission plus listing fees. Tixly&apos;s 8% flat rate means you keep more.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="w-10 h-1 bg-[#E8532A] rounded-full mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-black text-[#1A3C5E] mb-2">Sellers Love Tixly</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#E8532A] fill-[#E8532A]" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-[#E8532A]/20 mb-2" />
                <p className="text-sm text-slate-700 mb-5 flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-slate-100 pt-3">
                  <p className="font-bold text-sm text-[#1A3C5E]">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-[#1A3C5E] rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-[#E8532A] rounded-full opacity-15 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-[#2F6B9A] rounded-full opacity-20 blur-3xl" />
            <div className="relative z-10">
              <Wallet className="w-12 h-12 text-[#E8532A] mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Ready to List Your Tickets?</h2>
              <p className="text-slate-300 mb-6 max-w-lg mx-auto text-sm">It takes less than 2 minutes. Join the community and help fans experience the World Cup.</p>
              <Link href="/sign-in?callbackUrl=/en/sell/list" className="inline-flex items-center gap-2 bg-[#E8532A] hover:bg-[#d64a23] text-white font-bold text-sm py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Start Selling <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
