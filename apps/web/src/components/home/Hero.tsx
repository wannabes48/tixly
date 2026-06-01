'use client';
import { useLocale } from "next-intl";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Link } from '@/navigation';
import Image from 'next/image';

const WORLD_CUP_START = new Date('2026-06-11T00:00:00Z').getTime();

const POPULAR_SEARCHES = [
  'Argentina',
  'Brazil',
  'France',
  'USA',
  'Mexico',
  'New York',
  'Los Angeles',
  'Miami',
  'Final',
  'Semi-Final',
];

const QUICK_FILTERS = [
  { label: 'All Matches', round: '' },
  { label: 'Group Stage', round: 'group' },
  { label: 'Round of 32', round: 'round-of-32' },
  { label: 'Round of 16', round: 'round-of-16' },
  { label: 'Quarter-Finals', round: 'quarter-finals' },
  { label: 'Semi-Finals', round: 'semi-finals' },
  { label: 'Final', round: 'final' },
];

function useCountdown(targetMs: number) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, mounted: false };
  }

  const diff = Math.max(0, targetMs - now);
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  return { days, hours, minutes, seconds, mounted: true };
}

export default function Hero() {
  const locale = useLocale();

  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { days, hours, minutes, seconds, mounted } = useCountdown(WORLD_CUP_START);

  const filtered = POPULAR_SEARCHES.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/matches?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  const handleSelect = useCallback(
    (value: string) => {
      setQuery(value);
      setShowSuggestions(false);
      router.push(`/matches?q=${encodeURIComponent(value)}`);
    },
    [router]
  );

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => setShowSuggestions(false), 200);
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  const countdownUnits = [
    { label: 'Days', value: mounted ? pad(days) : '00' },
    { label: 'Hours', value: mounted ? pad(hours) : '00' },
    { label: 'Minutes', value: mounted ? pad(minutes) : '00' },
    { label: 'Seconds', value: mounted ? pad(seconds) : '00' },
  ];

  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(60px, -40px); }
          50% { transform: translate(-30px, 50px); }
          75% { transform: translate(40px, 20px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-50px, 30px); }
          50% { transform: translate(40px, -60px); }
          75% { transform: translate(-20px, -30px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, 50px); }
          50% { transform: translate(-60px, -20px); }
          75% { transform: translate(50px, -40px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-40px, -50px); }
          50% { transform: translate(50px, 30px); }
          75% { transform: translate(-30px, 60px); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(232,83,42,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(232,83,42,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,83,42,0); }
        }
      `}</style>

      {/* Background Image — packed stadium */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=80"
          alt="Packed Stadium Hero"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Gradient overlay: dark navy top to slightly lighter bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(13,33,55,0.92) 0%, rgba(13,33,55,0.75) 100%)',
        }}
      />

      {/* Diagonal stripe pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 28px, rgba(255,255,255,1) 28px, rgba(255,255,255,1) 30px)',
        }}
      />

      {/* Floating bokeh particles */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 400,
          top: '10%',
          left: '-5%',
          background: 'rgba(232,83,42,0.05)',
          animation: 'float-1 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: '30%',
          right: '-10%',
          background: 'rgba(47,107,154,0.1)',
          animation: 'float-2 25s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 250,
          height: 250,
          bottom: '15%',
          left: '20%',
          background: 'rgba(232,83,42,0.05)',
          animation: 'float-3 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 350,
          height: 350,
          top: '5%',
          right: '25%',
          background: 'rgba(47,107,154,0.08)',
          animation: 'float-4 22s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight mb-4 md:mb-5">
          <span className="text-white">FIFA World Cup 2026™</span>
          <br />
          <span className="text-[#E8532A]">Tickets</span>
        </h1>

        {/* Sub-heading */}
        <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-8 md:mb-10 px-2">
          The #1 secondary marketplace for all 104 matches across USA, Mexico &amp; Canada
        </p>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-10 md:mb-12">
          {countdownUnits.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-1.5 sm:gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center rounded-xl sm:rounded-2xl text-2xl sm:text-4xl md:text-5xl font-black text-white tabular-nums transition-all duration-500"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    ...(unit.label === 'Seconds'
                      ? { animation: 'pulse-ring 2s ease-in-out infinite' }
                      : {}),
                  }}
                >
                  {unit.value}
                </div>
                <span className="text-[9px] sm:text-[11px] uppercase tracking-widest text-white/50 mt-1.5 sm:mt-2 font-semibold">
                  {unit.label}
                </span>
              </div>
              {i < countdownUnits.length - 1 && (
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white/30 -mt-5 sm:-mt-6">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8 w-full">
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="flex flex-col sm:flex-row items-center bg-transparent sm:bg-white rounded-2xl sm:shadow-xl sm:shadow-black/10 overflow-hidden sm:ring-2 sm:ring-[#E8532A]/20 gap-2 sm:gap-0">
              <div className="flex items-center bg-white rounded-2xl w-full sm:w-auto flex-1 shadow-xl sm:shadow-none ring-2 ring-[#E8532A]/20 sm:ring-0">
                <div className="pl-4 sm:pl-5 pr-2 sm:pr-3 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search by team, city, or match…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="w-full py-3 sm:py-4 pr-2 text-gray-800 placeholder-gray-400 bg-transparent outline-none text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#E8532A] hover:bg-[#d14a25] text-white font-bold px-6 py-3 sm:mr-2 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl sm:shadow-none"
              >
                Find Tickets
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Autosuggest Dropdown */}
          {showSuggestions && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl shadow-black/15 border border-gray-100 py-2 z-50 overflow-hidden">
              {filtered.map((item) => (
                <button
                  key={item}
                  onMouseDown={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  <Search className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick-filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {QUICK_FILTERS.map((f) => (
            <Link
              key={f.label}
              href={f.round ? `/matches?round=${f.round}` : '/matches'}
              className="rounded-full bg-white/10 border border-white/15 text-white/80 hover:bg-[#E8532A] hover:border-[#E8532A] hover:text-white px-5 py-2 text-sm font-medium transition-all duration-200"
            >
              {f.label}
            </Link>
          ))}
        </div>

        {/* Host Country Flags */}
        <div className="flex items-center justify-center gap-10">
          {[
            { flag: '🇺🇸', name: 'USA' },
            { flag: '🇲🇽', name: 'Mexico' },
            { flag: '🇨🇦', name: 'Canada' },
          ].map((c) => (
            <div key={c.name} className="flex flex-col items-center gap-1.5">
              <span className="text-5xl">{c.flag}</span>
              <span className="text-xs text-white/60 font-medium tracking-[0.3em] uppercase">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
