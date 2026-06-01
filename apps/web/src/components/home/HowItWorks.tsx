import { useLocale } from "next-intl";
import { Link } from '@/navigation';
import { Search, ListFilter, CreditCard, ArrowRight } from "lucide-react";

interface Step {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: Search,
    title: "Find Your Match",
    description: "Browse all 104 World Cup 2026 matches by team, city, or date",
  },
  {
    number: 2,
    icon: ListFilter,
    title: "Choose Your Seats",
    description: "Compare prices, categories, and sellers to find the perfect tickets",
  },
  {
    number: 3,
    icon: CreditCard,
    title: "Buy Safely — No Login Required",
    description: "Pay by card, Apple Pay, or PayPal. Tickets arrive instantly by email.",
  },
];

export default function HowItWorks() {
  const locale = useLocale();

  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Stadium background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1920&q=80')",
        }}
      />
      {/* Heavy white overlay */}
      <div className="absolute inset-0 bg-white/95" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="w-12 h-1 bg-brand-orange rounded-full mx-auto mb-4" />
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-orange">
            Get your tickets in 3 simple steps
          </p>
          <h2 className="text-3xl font-extrabold text-brand-navy md:text-4xl">
            How It Works
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3 md:gap-12">
          {/* Curved dotted SVG connector (visible on md+) */}
          <svg
            className="pointer-events-none absolute top-16 left-0 hidden w-full md:block"
            viewBox="0 0 1200 80"
            fill="none"
            preserveAspectRatio="none"
            style={{ height: '80px' }}
          >
            <path
              d="M200,40 C350,0 450,80 600,40 C750,0 850,80 1000,40"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="8 6"
              fill="none"
            />
          </svg>

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center bg-white rounded-2xl shadow-card p-8 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              >
                {/* Number badge */}
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-base font-bold text-white shadow-md">
                  {step.number}
                </span>

                {/* Icon circle */}
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy to-brand-midblue text-white shadow-lg">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Text */}
                <h3 className="mb-2 text-lg font-bold text-brand-navy">{step.title}</h3>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-brand-mutedgrey">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/matches"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-10 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-xl"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
