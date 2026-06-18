import { Shield, CreditCard, BadgeCheck, Zap } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Shield, label: '100% Buyer Guarantee' },
  { icon: CreditCard, label: 'Secure Payments' },
  { icon: BadgeCheck, label: 'Verified Sellers' },
  { icon: Zap, label: 'Instant Delivery' },
];

export default function TrustBar() {
  return (
    <div className="relative bg-[#0D2137] py-6 overflow-hidden">
      {/* Subtle top gradient glow connecting with Hero */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(232,83,42,0.4) 50%, transparent 90%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-8 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(232,83,42,0.06) 0%, transparent 100%)',
        }}
      />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center flex-wrap gap-y-4">
          {TRUST_ITEMS.map((item, i) => (
            <div key={item.label} className="flex items-center">
              <div className="flex items-center gap-2.5 px-6">
                <item.icon className="w-6 h-6 text-[#E8532A] flex-shrink-0" />
                <span className="text-sm font-bold text-white whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              {i < TRUST_ITEMS.length - 1 && (
                <div className="hidden md:block w-px h-6 bg-white/10 backdrop-blur-md/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
