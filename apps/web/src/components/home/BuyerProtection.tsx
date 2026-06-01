'use client';
import { useLocale } from "next-intl";

import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';

const guaranteePoints = [
  '100% refund if tickets are not delivered',
  'Up to 150% refund in exceptional cases',
  '24/7 multilingual customer support',
  'Safe replacement tickets when available',
  'Full protection against fraudulent tickets',
];

export function BuyerProtection() {
  const locale = useLocale();

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Stadium background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80')",
            }}
          />
          {/* Dark navy overlay */}
          <div className="absolute inset-0 bg-brand-navy/90" />
          {/* Diagonal stripe pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 12px)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 lg:p-16 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left side */}
              <div>
                <ShieldCheck className="w-12 h-12 text-brand-orange mb-4 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Every Ticket Covered by{' '}
                  <span className="text-brand-orange">Tixly Protect™</span>
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Your peace of mind is our priority. Every purchase on Tixly is
                  backed by our comprehensive Tixly Protect™ guarantee — ensuring
                  you can buy World Cup 2026 tickets with complete confidence. If
                  anything goes wrong, we&apos;ve got you covered.
                </p>
              </div>

              {/* Right side */}
              <div>
                <ul className="space-y-3">
                  {guaranteePoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3 border border-white/10 transition-colors duration-200 hover:bg-white/10"
                    >
                      <ShieldCheck className="h-6 w-6 text-brand-orange flex-shrink-0" />
                      <span className="text-white text-base md:text-lg">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-10">
              <Link
                href="/buyer-protection"
                className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Learn More About Tixly Protect
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
