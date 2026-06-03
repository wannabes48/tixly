import { ShieldCheck, Lock, TicketCheck, Headset, CheckCircle2, BadgeCheck, Clock, ArrowRight, Zap, MessageCircle, AlertTriangle, RefreshCw, Ban, DollarSign, Users, Scale } from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";

export default function BuyerProtectionPage() {
  const stats = [
    { value: "500K+", label: "Tickets Sold" },
    { value: "99.8%", label: "Satisfaction" },
    { value: "24/7", label: "Live Support" },
    { value: "$0", label: "Fraud Losses" },
  ];

  const steps = [
    {
      number: "01",
      icon: BadgeCheck,
      title: "Verified Sellers",
      description: "Every seller passes strict KYC verification through Stripe Identity before any listing goes live.",
    },
    {
      number: "02",
      icon: Lock,
      title: "Secure Transaction",
      description: "Payment held in escrow until tickets are delivered and validated. Sellers never see your financial details.",
    },
    {
      number: "03",
      icon: TicketCheck,
      title: "Guaranteed Entry",
      description: "Invalid tickets? We provide replacements or a full refund — no questions asked.",
    },
  ];

  const protectionTiers = [
    {
      tier: "Tier 1",
      label: "Standard",
      title: "Delivery Guarantee",
      description: "100% refund if tickets are not delivered within 72 hours of match kick-off.",
      icon: Clock,
      accent: "border-l-[#E8532A]",
    },
    {
      tier: "Tier 2",
      label: "Standard",
      title: "Validity Guarantee",
      description: "Full refund if tickets are found invalid at stadium entry.",
      icon: ShieldCheck,
      accent: "border-l-[#1A3C5E]",
    },
    {
      tier: "Tier 3",
      label: "Standard",
      title: "Replacement Tickets",
      description: "Comparable replacement tickets at no extra cost if originals are invalid and alternatives are available.",
      icon: RefreshCw,
      accent: "border-l-[#E8532A]",
    },
    {
      tier: "Tier 4",
      label: "Exceptional",
      title: "Fraud Protection",
      description: "Up to 150% refund in rare cases of confirmed seller fraud.",
      icon: AlertTriangle,
      accent: "border-l-[#1A3C5E]",
    },
    {
      tier: "Tier 5",
      label: "Optional Add-on",
      title: "Cancel for Any Reason",
      description: "Paid add-on at checkout (~8–12% of order value). Cancel your order for any reason and receive a full refund.",
      icon: Ban,
      accent: "border-l-[#2F6B9A]",
    },
  ];

  const claimSteps = [
    { step: "1", title: "Submit Claim", description: "Contact us via /contact or live chat with your order details." },
    { step: "2", title: "24h Acknowledgement", description: "Our support team acknowledges your claim within 24 hours." },
    { step: "3", title: "Investigation", description: "We review evidence and work toward resolution within 72 hours." },
    { step: "4", title: "Resolution", description: "Replacement tickets issued or refund processed via original payment method." },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Authentic Tickets",
      description: "Automated fraud detection and manual review ensure only legitimate tickets are listed.",
      iconBg: "bg-[#E8532A]/10 text-[#E8532A]",
      accent: "bg-[#E8532A]",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "PCI DSS compliant. All payments processed through Stripe with 256-bit SSL encryption.",
      iconBg: "bg-[#1A3C5E]/10 text-[#1A3C5E]",
      accent: "bg-[#1A3C5E]",
    },
    {
      icon: Clock,
      title: "On-Time Delivery",
      description: "Digital tickets arrive within minutes. Physical tickets ship with full tracking and insurance.",
      iconBg: "bg-[#E8532A]/10 text-[#E8532A]",
      accent: "bg-[#E8532A]",
    },
    {
      icon: Headset,
      title: "24/7 Expert Support",
      description: "Multilingual support team available around the clock via live chat, email, and phone.",
      iconBg: "bg-[#1A3C5E]/10 text-[#1A3C5E]",
      accent: "bg-[#1A3C5E]",
    },
  ];

  const faqs = [
    {
      q: "What if my tickets don't work at the gate?",
      a: "Contact our support team immediately. We'll arrange comparable or better replacement tickets on the spot. If replacements aren't available, you'll receive a full refund including all service fees (Tier 2 protection).",
    },
    {
      q: "What if the event is cancelled?",
      a: "If a match is cancelled and not rescheduled, you receive a full refund including all fees. If postponed, your tickets automatically transfer to the new date at no extra cost.",
    },
    {
      q: "How do refunds work?",
      a: "Refunds are processed to your original payment method via Stripe within 5–10 business days. You'll receive email confirmation at every step.",
    },
    {
      q: "What is the dispute process?",
      a: "Your order enters DISPUTED status, the seller's payout is frozen, and our admin team reviews evidence from both parties. Resolution is issued within 72 hours — either a refund to you or payout release to the seller.",
    },
    {
      q: "What does 'Cancel for Any Reason' cover?",
      a: "This is an optional paid add-on (8–12% of order value) available at checkout. It lets you cancel your order for any reason and receive a full refund, regardless of the standard guarantee terms.",
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
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-[#E8532A]/20 text-[#E8532A] px-4 py-2 rounded-full font-bold text-xs mb-6 backdrop-blur-sm border border-[#E8532A]/20">
              <ShieldCheck className="w-4 h-4" />
              100% Tixly Protect™ Guarantee
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-5 text-white tracking-tight">
              Buy with Complete{" "}
              <span className="text-[#E8532A]">Confidence</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl">
              Every order on Tixly is automatically enrolled in Tixly Protect™ — our comprehensive buyer guarantee programme. Verified sellers, secure payments, and guaranteed entry or your money back.
            </p>
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

      {/* How Tixly Protect Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="w-10 h-1 bg-[#E8532A] rounded-full mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-black text-[#1A3C5E] mb-2">How Tixly Protect™ Works</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">Three layers of protection ensure every transaction is safe and guaranteed.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-px border-t-2 border-dashed border-slate-200" />
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="relative inline-block mb-4">
                  <span className="text-6xl font-black text-[#E8532A]/10 absolute -top-3 -left-3 select-none leading-none">{step.number}</span>
                  <div className="relative w-16 h-16 bg-[#E8532A]/10 rounded-xl flex items-center justify-center mx-auto shadow-sm">
                    <step.icon className="w-8 h-8 text-[#E8532A]" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#1A3C5E] mb-2 leading-tight">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protection Tiers */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="w-10 h-1 bg-[#E8532A] rounded-full mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-black text-[#1A3C5E] mb-2">Protection Tiers</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">Every order is automatically covered. Optional add-ons available for extra peace of mind.</p>
          </div>

          <div className="space-y-3">
            {protectionTiers.map((tier, i) => (
              <div key={i} className={`bg-white rounded-xl border border-slate-100 border-l-4 ${tier.accent} p-5 hover:shadow-md transition-all duration-200 flex items-start gap-4`}>
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <tier.icon className="w-5 h-5 text-[#1A3C5E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E8532A] bg-[#E8532A]/10 px-2 py-0.5 rounded">{tier.tier}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${tier.label === 'Optional Add-on' ? 'text-[#2F6B9A] bg-[#2F6B9A]/10' : 'text-slate-500 bg-slate-100'}`}>{tier.label}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1A3C5E] mb-0.5 leading-tight">{tier.title}</h3>
                  <p className="text-sm text-slate-600">{tier.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Claim Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="w-10 h-1 bg-[#E8532A] rounded-full mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-black text-[#1A3C5E] mb-2">Claim Process</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">24-hour acknowledgement SLA. Resolution within 72 hours.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {claimSteps.map((s, i) => (
              <div key={i} className="bg-slate-50 rounded-xl border border-slate-100 p-5 relative">
                <div className="w-8 h-8 bg-[#E8532A] text-white rounded-lg flex items-center justify-center font-bold text-sm mb-3">{s.step}</div>
                <h3 className="text-sm font-bold text-[#1A3C5E] mb-1 leading-tight">{s.title}</h3>
                <p className="text-xs text-slate-600">{s.description}</p>
                {i < claimSteps.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-white border border-slate-200 rounded-full items-center justify-center">
                    <ArrowRight className="w-2.5 h-2.5 text-[#E8532A]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dispute Flow */}
          <div className="mt-10 bg-[#1A3C5E] rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8532A]/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-[#E8532A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">Dispute Resolution</h3>
                <p className="text-sm text-slate-300 mb-4">In case of a dispute, your order enters <span className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-[#E8532A]">DISPUTED</span> status. The seller&apos;s payout is immediately frozen while our admin team reviews evidence from both parties. Resolution is issued within 72 hours — either a refund to you or payout release to the seller.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full">Payout Frozen</span>
                  <span className="text-xs font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full">Admin Review</span>
                  <span className="text-xs font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full">Evidence-Based</span>
                  <span className="text-xs font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full">72h Resolution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="w-10 h-1 bg-[#E8532A] rounded-full mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-black text-[#1A3C5E] mb-2">Why Fans Trust Tixly</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex gap-4">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className={`w-1 h-full rounded-full ${pillar.accent} opacity-20`} />
                </div>
                <div>
                  <div className={`w-11 h-11 ${pillar.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1A3C5E] mb-1.5 leading-tight">{pillar.title}</h3>
                  <p className="text-sm text-slate-600">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Covered */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="w-10 h-1 bg-[#E8532A] rounded-full mb-3" />
              <h2 className="text-3xl md:text-4xl font-black text-[#1A3C5E] mb-3">What&apos;s Covered</h2>
              <p className="text-sm text-slate-500 mb-8">Our guarantee covers every scenario so you can focus on enjoying the World Cup.</p>
              <div className="space-y-2.5">
                {[
                  "100% refund if tickets not delivered within 72h of kick-off",
                  "Full refund if tickets are invalid at stadium entry",
                  "Replacement tickets at no extra cost when available",
                  "Up to 150% refund in cases of confirmed seller fraud",
                  "Full refund for cancelled events including all fees",
                  "Tickets automatically valid for rescheduled dates",
                  "Optional cancel-for-any-reason add-on at checkout",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100 hover:bg-[#EAF1F8] transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-[#E8532A] flex-shrink-0" />
                    <span className="text-[#1A3C5E] font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
              <Image src="https://res.cloudinary.com/dm12f7lnc/image/upload/v1780465132/ball_s8bnqa.jpg" alt="Soccer ball on field" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C5E]/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <div className="w-10 h-1 bg-[#E8532A] rounded-full mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-black text-[#1A3C5E] mb-2">Common Questions</h2>
            <p className="text-sm text-slate-500">Everything you need to know about Tixly Protect™.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-[#E8532A] flex-shrink-0" />
                    <h3 className="text-sm font-bold text-[#1A3C5E] leading-tight">{faq.q}</h3>
                  </div>
                  <p className="text-sm text-slate-600 pl-6">{faq.a}</p>
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
              <ShieldCheck className="w-12 h-12 text-[#E8532A] mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Ready to find your perfect seats?</h2>
              <p className="text-slate-300 mb-6 max-w-lg mx-auto text-sm">Every ticket is protected by Tixly Protect™. Browse matches with complete peace of mind.</p>
              <Link href="/matches" className="inline-flex items-center gap-2 bg-[#E8532A] hover:bg-[#d64a23] text-white font-bold text-sm py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Browse Matches <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
