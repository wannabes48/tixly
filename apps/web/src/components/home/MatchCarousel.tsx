'use client';
import { useLocale } from "next-intl";

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';

interface Match {
  id: string;
  date: string;
  dateShort: string;
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  stadium: string;
  city: string;
  priceFrom: number;
}

const MATCHES: Match[] = [
  {
    id: 'match-1',
    date: 'JUN 11 · THU',
    dateShort: '2026-06-11',
    homeTeam: 'Mexico',
    homeFlag: '🇲🇽',
    awayTeam: 'Canada',
    awayFlag: '🇨🇦',
    stadium: 'Estadio Azteca',
    city: 'Mexico City',
    priceFrom: 150,
  },
  {
    id: 'match-2',
    date: 'JUN 12 · FRI',
    dateShort: '2026-06-12',
    homeTeam: 'Argentina',
    homeFlag: '🇦🇷',
    awayTeam: 'France',
    awayFlag: '🇫🇷',
    stadium: 'MetLife Stadium',
    city: 'New York / New Jersey',
    priceFrom: 450,
  },
  {
    id: 'match-3',
    date: 'JUN 13 · SAT',
    dateShort: '2026-06-13',
    homeTeam: 'USA',
    homeFlag: '🇺🇸',
    awayTeam: 'Brazil',
    awayFlag: '🇧🇷',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    priceFrom: 380,
  },
  {
    id: 'match-4',
    date: 'JUN 14 · SUN',
    dateShort: '2026-06-14',
    homeTeam: 'Germany',
    homeFlag: '🇩🇪',
    awayTeam: 'Spain',
    awayFlag: '🇪🇸',
    stadium: 'Hard Rock Stadium',
    city: 'Miami',
    priceFrom: 320,
  },
  {
    id: 'match-5',
    date: 'JUN 15 · MON',
    dateShort: '2026-06-15',
    homeTeam: 'England',
    homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    awayTeam: 'Portugal',
    awayFlag: '🇵🇹',
    stadium: 'AT&T Stadium',
    city: 'Dallas',
    priceFrom: 290,
  },
  {
    id: 'match-6',
    date: 'JUN 16 · TUE',
    dateShort: '2026-06-16',
    homeTeam: 'Japan',
    homeFlag: '🇯🇵',
    awayTeam: 'Netherlands',
    awayFlag: '🇳🇱',
    stadium: 'BMO Field',
    city: 'Toronto',
    priceFrom: 180,
  },
];

export default function MatchCarousel() {
  const locale = useLocale();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="py-16 bg-[#f9fafb] relative overflow-hidden"
    >
      {/* Subtle football pitch pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.02,
          backgroundImage: `
            linear-gradient(rgba(13,33,55,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13,33,55,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(13,33,55,0.4) 60px, transparent 60px),
            radial-gradient(circle at 50% 50%, transparent 58px, rgba(13,33,55,0.4) 58px, rgba(13,33,55,0.4) 60px, transparent 60px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 160px 160px, 160px 160px',
          backgroundPosition: 'center center',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {/* Orange accent bar */}
            <div className="w-12 h-1 bg-[#E8532A] rounded-full mb-3" />
            <h2 className="text-3xl md:text-4xl font-black text-[#0D2137] mb-1">
              Upcoming Matches
            </h2>
            <p className="text-gray-500 text-sm">320,000+ tickets available</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-[#0D2137] hover:bg-[#E8532A] flex items-center justify-center text-white transition-colors duration-200 shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-[#0D2137] hover:bg-[#E8532A] flex items-center justify-center text-white transition-colors duration-200 shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href="/matches"
              className="hidden md:flex items-center gap-1.5 text-[#E8532A] font-semibold text-sm hover:underline ml-2"
            >
              View All Matches
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {MATCHES.map((match) => (
            <div
              key={match.id}
              className="min-w-[320px] max-w-[340px] bg-white rounded-2xl border border-gray-100 flex flex-col hover:scale-[1.02] transition-all duration-300 snap-start"
              style={{
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 16px 40px rgba(0,0,0,0.14)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 2px 12px rgba(0,0,0,0.06)';
              }}
            >
              {/* Gradient top bar */}
              <div
                className="h-1 rounded-t-2xl"
                style={{
                  background: 'linear-gradient(to right, #E8532A, #2F6B9A)',
                }}
              />

              {/* Card Top */}
              <div className="p-5 pb-0">
                {/* Date Badge */}
                <span className="inline-block text-xs font-bold text-white bg-[#0D2137] px-2.5 py-1 rounded-full mb-4">
                  {match.date}
                </span>

                {/* Team Matchup */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-3xl mb-1.5">{match.homeFlag}</span>
                    <span className="text-sm font-black text-[#0D2137] text-center truncate w-full">
                      {match.homeTeam}
                    </span>
                  </div>

                  <span className="flex-shrink-0 bg-[#E8532A] text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider">
                    VS
                  </span>

                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-3xl mb-1.5">{match.awayFlag}</span>
                    <span className="text-sm font-black text-[#0D2137] text-center truncate w-full">
                      {match.awayTeam}
                    </span>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-center gap-1.5 text-gray-400 mb-4">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-xs truncate">
                    {match.stadium}, {match.city}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-200 mx-5" />

              {/* Bottom: Price + CTA */}
              <div className="p-5 pt-4 flex items-center justify-between mt-auto">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">
                    From
                  </p>
                  <p className="text-2xl font-black text-[#0D2137]">
                    ${match.priceFrom}
                  </p>
                </div>
                <Link
                  href={`matches/${match.id}`}
                  className="bg-[#E8532A] hover:bg-[#c74823] text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  Buy Tickets
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All link */}
        <div className="flex md:hidden justify-center mt-6">
          <Link
            href="/matches"
            className="flex items-center gap-1.5 text-[#E8532A] font-semibold text-sm hover:underline"
          >
            View All Matches
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
