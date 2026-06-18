'use client';
import { useLocale } from "next-intl";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Link } from '@/navigation';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WORLD_CUP_END = new Date('2026-07-19T23:59:59Z').getTime();

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
  const [matchRound, setMatchRound] = useState('');
  const [matchQuantity, setMatchQuantity] = useState('1');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { days, hours, minutes, seconds, mounted } = useCountdown(WORLD_CUP_END);

  const filtered = POPULAR_SEARCHES.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (matchRound) params.set('round', matchRound);
      if (matchQuantity && matchQuantity !== '1') params.set('quantity', matchQuantity);
      
      router.push(`/matches?${params.toString()}`);
    },
    [query, matchRound, matchQuantity, router]
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

      {/* Background Image removed to show global gradient */}
      <div
        className="absolute inset-0 pointer-events-none bg-brand-navy/30"
      />      {/* Diagonal stripe pattern overlay */}
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
          <span className="text-tixOrange">Tickets</span>
        </h1>

        {/* Sub-heading */}
        <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-8 md:mb-10 px-2">
          The #1 secondary marketplace for all 104 matches across USA, Mexico &amp; Canada
        </p>

        {/* Countdown Timer */}
        <div className="flex flex-col items-center justify-center mb-10 md:mb-12">
          <p className="text-white/80 uppercase tracking-widest text-[11px] sm:text-xs font-bold mb-5 tracking-editorial">Time Remaining Until Tournament Ends</p>
          <div className="flex items-center justify-center gap-1.5 sm:gap-3">
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
                  <span className="text-[10px] sm:text-[12px] uppercase tracking-editorial text-white/60 mt-1.5 sm:mt-2 font-medium">
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
        </div>

        {/* Match Finder Widget (Flight Booking Style) */}
        <div className="relative max-w-4xl mx-auto mb-10 w-full">
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col md:flex-row flex-wrap gap-4 border border-slate-100 z-10 relative mt-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-editorial mb-1.5 text-left">Team or City</label>
              <Select value={query} onValueChange={setQuery}>
                <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200 text-slate-800 font-normal focus:ring-1 focus:ring-tixOrange focus:border-tixOrange">
                  <SelectValue placeholder="Any Team or City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Team or City</SelectItem>
                  <SelectItem value="Argentina">Argentina</SelectItem>
                  <SelectItem value="Brazil">Brazil</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
                  <SelectItem value="New York">New York / NJ</SelectItem>
                  <SelectItem value="Miami">Miami</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-editorial mb-1.5 text-left">Tournament Round</label>
              <Select value={matchRound} onValueChange={setMatchRound}>
                <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200 text-slate-800 font-normal focus:ring-1 focus:ring-tixOrange focus:border-tixOrange">
                  <SelectValue placeholder="Any Round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Round</SelectItem>
                  <SelectItem value="group">Group Stage</SelectItem>
                  <SelectItem value="round-of-32">Round of 32</SelectItem>
                  <SelectItem value="round-of-16">Round of 16</SelectItem>
                  <SelectItem value="quarter">Quarter-Finals</SelectItem>
                  <SelectItem value="semi">Semi-Finals</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-32">
              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-editorial mb-1.5 text-left">Quantity</label>
              <Select value={matchQuantity} onValueChange={setMatchQuantity}>
                <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200 text-slate-800 font-normal focus:ring-1 focus:ring-tixOrange focus:border-tixOrange">
                  <SelectValue placeholder="1 Ticket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Ticket</SelectItem>
                  <SelectItem value="2">2 Tickets</SelectItem>
                  <SelectItem value="3">3 Tickets</SelectItem>
                  <SelectItem value="4">4 Tickets</SelectItem>
                  <SelectItem value="5">5+ Tickets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-auto flex items-end">
              <button
                type="submit"
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-tixOrange hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-md"
              >
                Search Matches
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick-filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {QUICK_FILTERS.map((f) => (
            <Link
              key={f.label}
              href={f.round ? `/matches?round=${f.round}` : '/matches'}
              className="rounded-full bg-white/10 backdrop-blur-md/10 border border-white/15 text-white/80 hover:bg-tixOrange hover:border-tixOrange hover:text-white px-5 py-2 text-sm font-medium transition-all duration-200"
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
              <span className="text-xs text-white/60 font-medium tracking-editorial uppercase">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
