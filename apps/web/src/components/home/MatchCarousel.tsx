'use client';
import React, { useState, useEffect } from 'react';
import { useLocale } from "next-intl";
import { Link } from '@/navigation';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import { LocalTime } from '@/components/LocalTime';

interface Match {
  id: string;
  date: string;
  dateShort: string;
  homeTeam: string;
  homeFlagUrl: string;
  awayTeam: string;
  awayFlagUrl: string;
  stadium: string;
  city: string;
  priceFrom: number;
  bgImage?: string;
  kickoffUtc: string;
}

const DEFAULT_MATCHES: Match[] = [
  {
    id: 'match-1',
    date: 'JUN 11 · THU',
    dateShort: '2026-06-11',
    homeTeam: 'Mexico',
    homeFlagUrl: 'https://flagcdn.com/w320/mx.png',
    awayTeam: 'Canada',
    awayFlagUrl: 'https://flagcdn.com/w320/ca.png',
    stadium: 'Estadio Azteca',
    city: 'Mexico City',
    priceFrom: 150,
    bgImage: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307185/Estadio_Azteca_-_2026_-_02_jpevn0.jpg",
    kickoffUtc: '2026-06-11T20:00:00Z'
  },
  {
    id: 'match-2',
    date: 'JUN 12 · FRI',
    dateShort: '2026-06-12',
    homeTeam: 'Argentina',
    homeFlagUrl: 'https://flagcdn.com/w320/ar.png',
    awayTeam: 'France',
    awayFlagUrl: 'https://flagcdn.com/w320/fr.png',
    stadium: 'MetLife Stadium',
    city: 'New York / New Jersey',
    priceFrom: 450,
    bgImage: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307182/Metlife_stadium__Aerial_view_ozywne.jpg",
    kickoffUtc: '2026-06-12T20:00:00Z'
  },
  {
    id: 'match-3',
    date: 'JUN 13 · SAT',
    dateShort: '2026-06-13',
    homeTeam: 'USA',
    homeFlagUrl: 'https://flagcdn.com/w320/us.png',
    awayTeam: 'Brazil',
    awayFlagUrl: 'https://flagcdn.com/w320/br.png',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    priceFrom: 380,
    bgImage: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307236/SoFi_Stadium_2023_fzzuuc.jpg",
    kickoffUtc: '2026-06-13T20:00:00Z'
  },
  {
    id: 'match-4',
    date: 'JUN 14 · SUN',
    dateShort: '2026-06-14',
    homeTeam: 'Germany',
    homeFlagUrl: 'https://flagcdn.com/w320/de.png',
    awayTeam: 'Spain',
    awayFlagUrl: 'https://flagcdn.com/w320/es.png',
    stadium: 'Hard Rock Stadium',
    city: 'Miami',
    priceFrom: 320,
    bgImage: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307062/hard-rock-stadium-hero_kxq0ml.jpg",
    kickoffUtc: '2026-06-14T20:00:00Z'
  },
  {
    id: 'match-5',
    date: 'JUN 15 · MON',
    dateShort: '2026-06-15',
    homeTeam: 'England',
    homeFlagUrl: 'https://flagcdn.com/w320/gb-eng.png',
    awayTeam: 'Portugal',
    awayFlagUrl: 'https://flagcdn.com/w320/pt.png',
    stadium: 'AT&T Stadium',
    city: 'Dallas',
    priceFrom: 290,
    bgImage: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307180/ATT_economic-1_jqbqoh.jpg",
    kickoffUtc: '2026-06-15T20:00:00Z'
  },
  {
    id: 'match-6',
    date: 'JUN 16 · TUE',
    dateShort: '2026-06-16',
    homeTeam: 'Japan',
    homeFlagUrl: 'https://flagcdn.com/w320/jp.png',
    awayTeam: 'Netherlands',
    awayFlagUrl: 'https://flagcdn.com/w320/nl.png',
    stadium: 'BMO Field',
    city: 'Toronto',
    priceFrom: 180,
    bgImage: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307178/bmo_field_ngoycc.avif",
    kickoffUtc: '2026-06-16T20:00:00Z'
  }
];

export default function MatchCarousel({ matches = DEFAULT_MATCHES }: { matches?: Match[] }) {
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    matches.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [matches]);

  return (
    <section className="py-20 bg-[#0D2137] relative overflow-hidden font-sans">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A3C5E] to-[#0D2137] opacity-50 z-0 pointer-events-none" />

      {/* Header Section */}
      <div className="container mx-auto px-4 mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between relative z-10 gap-6">
        <div>
          <p className="text-[13px] font-medium text-[#E8532A] uppercase tracking-editorial mb-3 mx-auto md:mx-0 animate-fadeInTop">
            Featured
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3 drop-shadow-lg animate-fadeInTop delay-300">
            Upcoming Matches
          </h2>
          <p className="text-base text-gray-300 font-normal max-w-xl animate-fadeInTop delay-600 leading-relaxed">
            Secure your seats for the most anticipated games of the tournament. 320,000+ tickets available.
          </p>
        </div>
        
        <Link
          href="/matches"
          className="inline-flex items-center justify-center gap-1.5 text-white bg-white/10 backdrop-blur-md/10 hover:bg-white/10 backdrop-blur-md/20 border border-white/20 backdrop-blur-md px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl group"
        >
          View All Matches
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Options Container (Desktop Accordion) */}
      <div className="container mx-auto px-4 relative z-10 hidden md:block">
        <div className="options flex w-full h-[600px] items-stretch overflow-hidden relative shadow-2xl rounded-2xl">
          {matches.map((match, index) => {
            const bgImage = match.bgImage || DEFAULT_MATCHES.find(m => m.stadium === match.stadium)?.bgImage || DEFAULT_MATCHES[index % DEFAULT_MATCHES.length].bgImage;
            const isUpcoming = match.kickoffUtc ? new Date(match.kickoffUtc).getTime() > Date.now() : true;
            return (
            <div
              key={match.id}
              className={`
                option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out
                ${activeIndex === index ? 'active' : ''}
              `}
              style={{
                backgroundImage: `url('${bgImage}')`,
                backgroundSize: activeIndex === index ? 'auto 100%' : 'auto 120%',
                backgroundPosition: 'center',
                backfaceVisibility: 'hidden',
                opacity: animatedOptions.includes(index) ? 1 : 0,
                transform: animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-60px)',
                minWidth: '70px',
                minHeight: '100px',
                margin: 0,
                borderWidth: '0 1px 0 0',
                borderStyle: 'solid',
                borderColor: '#1a2c42',
                cursor: 'pointer',
                backgroundColor: '#0D2137',
                flex: activeIndex === index ? '10 1 0%' : '1 1 0%',
                zIndex: activeIndex === index ? 10 : 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                position: 'relative',
                overflow: 'hidden',
                willChange: 'flex-grow, box-shadow, background-size, background-position'
              }}
              onClick={() => handleOptionClick(index)}
            >
              {/* Shadow effect */}
              <div 
                className="shadow absolute left-0 right-0 pointer-events-none transition-all duration-700 ease-in-out z-[1]"
                style={{
                  bottom: activeIndex === index ? '0' : '-40px',
                  height: '100%',
                  background: activeIndex === index 
                    ? 'linear-gradient(to top, rgba(13,33,55,1) 0%, rgba(13,33,55,0.7) 30%, transparent 60%)'
                    : 'linear-gradient(to top, rgba(13,33,55,1) 0%, transparent 50%)'
                }}
              ></div>
              
              {/* Label Content */}
              <div className="label absolute left-0 right-0 bottom-6 flex items-end justify-start z-[2] pointer-events-none px-4 md:px-8 w-full">
                
                {/* Closed State Vertical Text */}
                <div 
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 font-medium text-white tracking-editorial uppercase whitespace-nowrap transition-all duration-500 origin-bottom-left"
                  style={{
                    transform: 'rotate(-90deg) translateX(0)',
                    opacity: activeIndex === index ? 0 : 1,
                    width: '300px', 
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#E8532A] opacity-80">{match.date.split('·')[0].trim()}</span>
                    <span>{match.homeTeam} vs {match.awayTeam}</span>
                  </div>
                </div>

                {/* Expanded Content */}
                <div 
                  className="info text-white w-full flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-700 ease-in-out pointer-events-auto pb-4"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)',
                    display: activeIndex === index ? 'flex' : 'none'
                  }}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center justify-center bg-[#E8532A] text-white text-[12px] font-medium px-4 py-1.5 rounded-full uppercase tracking-editorial shadow-lg">
                        {match.kickoffUtc ? <LocalTime date={match.kickoffUtc} format="datetime" /> : match.date}
                      </span>
                      <div className="flex items-center gap-2 text-white text-sm font-semibold bg-white/10 backdrop-blur-md/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                        <MapPin size={16} /> {match.stadium}, {match.city}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mb-2 flex-wrap">
                      <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="w-14 h-14 relative rounded-full overflow-hidden border-2 border-white/20 shadow-inner bg-white/10 backdrop-blur-md">
                          <Image src={match.homeFlagUrl} alt={match.homeTeam} fill className="object-cover" />
                        </div>
                        <span className="text-3xl lg:text-4xl font-black tracking-tight">{match.homeTeam}</span>
                        
                        <span className="text-xl font-black text-[#E8532A] mx-2 italic">VS</span>
                        
                        <span className="text-3xl lg:text-4xl font-black tracking-tight">{match.awayTeam}</span>
                        <div className="w-14 h-14 relative rounded-full overflow-hidden border-2 border-white/20 shadow-inner bg-white/10 backdrop-blur-md">
                          <Image src={match.awayFlagUrl} alt={match.awayTeam} fill className="object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end flex-shrink-0 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
                    {isUpcoming ? (
                      <>
                        <p className="text-[11px] font-medium text-gray-300 uppercase tracking-editorial mb-1">Starting From</p>
                        <p className="text-5xl font-black text-white mb-4 flex items-start gap-1">
                          <span className="text-2xl mt-1 text-[#E8532A]">$</span>
                          {match.priceFrom}
                        </p>
                        <Link
                          href={`/matches/${match.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#E8532A] hover:bg-[#d64a23] text-white font-bold py-3.5 px-8 rounded-xl transition-colors shadow-[0_0_20px_rgba(232,83,42,0.4)] hover:shadow-[0_0_25px_rgba(232,83,42,0.6)] text-lg"
                        >
                          <Image src="/ticket.png" alt="Ticket" width={20} height={20} className="w-5 h-5 object-contain" /> Buy Tickets
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="text-[11px] font-medium text-gray-300 uppercase tracking-editorial mb-1">Status</p>
                        <p className="text-3xl font-black text-gray-400 mb-4 flex items-start gap-1 mt-2">
                          Match Started
                        </p>
                        <button
                          disabled
                          className="w-full inline-flex items-center justify-center gap-2 bg-gray-500/50 text-gray-300 font-bold py-3.5 px-8 rounded-xl cursor-not-allowed text-lg border border-gray-400/30"
                        >
                          Unavailable
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* Mobile Snap Carousel */}
      <div className="md:hidden relative z-10 w-full overflow-hidden mt-6">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-8 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {matches.map((match, index) => {
            const bgImage = match.bgImage || DEFAULT_MATCHES.find(m => m.stadium === match.stadium)?.bgImage || DEFAULT_MATCHES[index % DEFAULT_MATCHES.length].bgImage;
            const isUpcoming = match.kickoffUtc ? new Date(match.kickoffUtc).getTime() > Date.now() : true;
            return (
              <div 
                key={match.id} 
                className="flex-none w-[85vw] max-w-[340px] h-[480px] relative rounded-3xl overflow-hidden snap-center shadow-2xl flex flex-col justify-end group border border-white/10"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${bgImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137] via-[#0D2137]/80 to-transparent" />
                
                <div className="relative z-10 p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E8532A] text-white text-[11px] font-medium px-3 py-1.5 rounded-full uppercase tracking-editorial shadow-lg">
                      {match.kickoffUtc ? <LocalTime date={match.kickoffUtc} format="datetime" /> : match.date}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <div className="flex flex-col items-center w-16">
                      <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white/20 shadow-inner bg-white/10 backdrop-blur-md mb-2">
                        <Image src={match.homeFlagUrl} alt={match.homeTeam} fill className="object-cover" />
                      </div>
                      <span className="text-white font-bold text-xs text-center truncate w-full">{match.homeTeam}</span>
                    </div>
                    <span className="text-[#E8532A] font-black italic text-xl flex-1 text-center">VS</span>
                    <div className="flex flex-col items-center w-16">
                      <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white/20 shadow-inner bg-white/10 backdrop-blur-md mb-2">
                        <Image src={match.awayFlagUrl} alt={match.awayTeam} fill className="object-cover" />
                      </div>
                      <span className="text-white font-bold text-xs text-center truncate w-full">{match.awayTeam}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                    <MapPin size={14} className="flex-shrink-0 text-[#E8532A]" /> 
                    <span className="truncate">{match.stadium}, {match.city}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-5 border-t border-white/10">
                    {isUpcoming ? (
                      <>
                        <div>
                          <p className="text-white/60 text-[10px] uppercase font-medium tracking-editorial mb-0.5">Starting From</p>
                          <p className="text-white font-black text-3xl flex items-start gap-0.5">
                            <span className="text-lg mt-1 text-[#E8532A]">$</span>{match.priceFrom}
                          </p>
                        </div>
                        <Link
                          href={`/matches/${match.id}`}
                          className="bg-[#E8532A] hover:bg-[#d64a23] text-white p-3.5 rounded-xl transition-all shadow-lg flex-shrink-0"
                        >
                          <ArrowRight size={20} />
                        </Link>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-white/60 text-[10px] uppercase font-medium tracking-editorial mb-0.5">Status</p>
                          <p className="text-gray-400 font-black text-xl flex items-start gap-0.5 mt-1">
                            Started
                          </p>
                        </div>
                        <button
                          disabled
                          className="bg-gray-600/50 text-gray-400 p-3.5 rounded-xl cursor-not-allowed flex-shrink-0 border border-gray-500/30"
                        >
                          Unavailable
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Custom animations */}
      <style>{`
        @keyframes fadeInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInTop {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInFromTop 0.8s ease-in-out forwards;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-600 {
          animation-delay: 0.6s;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
