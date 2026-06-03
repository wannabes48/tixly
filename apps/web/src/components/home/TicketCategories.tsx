import { Crown, Eye, Target, Wallet, Accessibility } from "lucide-react";

interface Category {
  title: string;
  description: string;
  priceRange: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
  iconBg: string;
}

const categories: Category[] = [
  {
    title: "Premium Central",
    description: "Best seats in the house",
    priceRange: "$800–$2,500",
    icon: Crown,
    bgColor: "bg-[#1A3C5E]",
    textColor: "text-white",
    iconBg: "bg-white/15",
  },
  {
    title: "Excellent View",
    description: "Great sightlines from the sides",
    priceRange: "$400–$1,200",
    icon: Eye,
    bgColor: "bg-[#2F6B9A]",
    textColor: "text-white",
    iconBg: "bg-white/15",
  },
  {
    title: "Behind Goal",
    description: "Behind the goal action",
    priceRange: "$200–$600",
    icon: Target,
    bgColor: "bg-[#EAF1F8]",
    textColor: "text-[#1A3C5E]",
    iconBg: "bg-[#2F6B9A]/15",
  },
  {
    title: "Budget Friendly",
    description: "Affordable entry",
    priceRange: "$100–$350",
    icon: Wallet,
    bgColor: "bg-gray-100",
    textColor: "text-[#1A3C5E]",
    iconBg: "bg-[#2F6B9A]/15",
  },
];

export default function TicketCategories() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1920&q=80")',
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-navy/90" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-[13px] font-medium uppercase tracking-editorial text-brand-orange">
            Choose the right category for your budget and view
          </p>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Ticket Categories
          </h2>
        </div>

        {/* Category cards */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            // Apply glassmorphism by making backgrounds slightly transparent
            const isNavy = cat.bgColor.includes('1A3C5E');
            const isMidBlue = cat.bgColor.includes('2F6B9A');
            const isPaleBlue = cat.bgColor.includes('EAF1F8');
            const isGray = cat.bgColor.includes('gray-100');

            let glassBg = cat.bgColor;
            let textColor = cat.textColor;
            if (isNavy) glassBg = "bg-brand-navy/70 backdrop-blur-md border border-white/10";
            if (isMidBlue) glassBg = "bg-brand-midblue/70 backdrop-blur-md border border-white/10";
            if (isPaleBlue) {
              glassBg = "bg-brand-paleblue/90 backdrop-blur-md border border-white/20";
              textColor = "text-brand-navy";
            }
            if (isGray) {
              glassBg = "bg-white/90 backdrop-blur-md border border-white/20";
              textColor = "text-brand-navy";
            }

            return (
              <div
                key={cat.title}
                className={`flex flex-col items-start rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg ${glassBg} ${textColor}`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${cat.iconBg}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{cat.title}</h3>
                <p className="mt-1 text-base font-normal opacity-80">{cat.description}</p>
                <p className="mt-4 text-xl font-semibold">{cat.priceRange}</p>
              </div>
            );
          })}
        </div>

        {/* Accessibility note */}
        <div className="mt-8 flex items-center justify-center gap-3 rounded-xl bg-brand-navy/50 backdrop-blur-sm border border-brand-midblue/30 px-5 py-4 text-sm text-white">
          <Accessibility className="h-5 w-5 shrink-0 text-brand-orange" />
          <p>
            <span className="font-semibold text-brand-orange">Accessibility tickets</span> — Wheelchair
            and Easy Access seating available in every category. Look for the{" "}
            <Accessibility className="inline h-4 w-4 align-text-bottom text-brand-orange" />{" "}
            icon when selecting seats.
          </p>
        </div>
      </div>
    </section>
  );
}
