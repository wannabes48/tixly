import React from 'react';
import { QrCode, Trophy } from 'lucide-react';

interface TicketReceiptProps {
  match: {
    homeTeam: { name: string; code: string };
    awayTeam: { name: string; code: string };
    stadium: { name: string; city: string };
    date: Date;
  };
  section?: string;
  row?: string;
  seat?: string;
  message?: string;
}

const getFlag = (cc: string) => String.fromCodePoint(...cc.toUpperCase().split('').map(c => c.charCodeAt(0) + 127397));

export const TicketReceipt = React.forwardRef<HTMLDivElement, TicketReceiptProps>(
  ({ match, section = '104', row = 'G', seat = '21', message = 'FIFA WORLD CUP 2026™' }, ref) => {
    
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(match.date));

    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(match.date));

    return (
      <div 
        ref={ref} 
        className="flex w-[800px] h-[300px] bg-white text-black font-sans shadow-2xl relative overflow-hidden shrink-0 border-2 border-black"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Left Stub: ADMIT ONE */}
        <div className="w-[80px] bg-black text-white flex flex-col items-center justify-between py-6 shrink-0">
          <div className="flex-1 flex items-center justify-center -rotate-90 whitespace-nowrap">
            <span className="text-3xl font-black tracking-widest">ADMIT ONE</span>
          </div>
          {/* Mock Barcode */}
          <div className="flex gap-[2px] h-32 px-2 items-end justify-center w-full bg-white mt-4">
            <div className="w-1 h-full bg-black"></div>
            <div className="w-0.5 h-full bg-black"></div>
            <div className="w-1.5 h-full bg-black"></div>
            <div className="w-0.5 h-full bg-black"></div>
            <div className="w-1 h-full bg-black"></div>
            <div className="w-2 h-full bg-black"></div>
            <div className="w-0.5 h-full bg-black"></div>
            <div className="w-1.5 h-full bg-black"></div>
            <div className="w-1 h-full bg-black"></div>
            <div className="w-0.5 h-full bg-black"></div>
            <div className="w-2 h-full bg-black"></div>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 flex flex-col px-8 py-6 relative">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-black tracking-wider uppercase">FIFA WORLD CUP 2026</h1>
            <p className="text-sm font-bold text-gray-500 tracking-[0.2em] mt-1">USA <span className="text-red-500">•</span> CANADA <span className="text-brand-orange">•</span> MEXICO</p>
          </div>

          {/* Teams / VS Area */}
          <div className="flex items-center justify-between mt-4">
            {/* Home Team */}
            <div className="flex flex-col items-center w-1/3">
              <h2 className="text-xl font-black uppercase mb-2">{match.homeTeam.name}</h2>
              <div className="text-6xl drop-shadow-md">
                {getFlag(match.homeTeam.code)}
              </div>
            </div>

            {/* VS & Trophy */}
            <div className="flex flex-col items-center justify-center w-1/3 relative">
              <Trophy size={64} className="text-yellow-500 opacity-20 absolute" />
              <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center z-10 font-black italic shadow-lg transform -rotate-12">
                VS
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center w-1/3">
              <h2 className="text-xl font-black uppercase mb-2">{match.awayTeam.name}</h2>
              <div className="text-6xl drop-shadow-md">
                {getFlag(match.awayTeam.code)}
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="text-center mt-auto">
            <p className="text-lg font-bold uppercase tracking-widest">{match.stadium.name}</p>
            <p className="text-md font-semibold text-gray-600 uppercase tracking-widest mt-1">{formattedDate}</p>
          </div>

          {/* Bottom Message */}
          <div className="absolute bottom-4 left-0 w-full text-center">
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-gray-400" style={{ fontFamily: 'monospace' }}>
              {message}
            </p>
          </div>
        </div>

        {/* Right Stub Divider (Perforated) */}
        <div className="w-[2px] h-full bg-transparent border-l-4 border-dashed border-gray-300 relative z-10"></div>

        {/* Right Stub */}
        <div className="w-[200px] flex flex-col py-6 px-4 shrink-0 bg-gray-50 relative">
          
          <div className="text-center mb-6">
            <p className="text-xs font-black uppercase">{match.homeTeam.name}</p>
            <p className="text-xs font-black italic my-1">VS</p>
            <p className="text-xs font-black uppercase">{match.awayTeam.name}</p>
            <p className="text-xs font-bold mt-2">AT {formattedTime}</p>
          </div>

          <div className="space-y-3 mb-auto">
            <div className="flex items-center justify-between border-2 border-black rounded-md px-2 py-1 bg-white">
              <span className="text-xs font-bold">SEC#</span>
              <span className="font-bold">{section}</span>
            </div>
            <div className="flex items-center justify-between border-2 border-black rounded-md px-2 py-1 bg-white">
              <span className="text-xs font-bold">ROW#</span>
              <span className="font-bold">{row}</span>
            </div>
            <div className="flex items-center justify-between border-2 border-black rounded-md px-2 py-1 bg-white">
              <span className="text-xs font-bold">SEAT#</span>
              <span className="font-bold">{seat}</span>
            </div>
          </div>

          <div className="absolute bottom-6 right-6">
            <QrCode size={40} className="text-black" />
          </div>
        </div>
      </div>
    );
  }
);

TicketReceipt.displayName = 'TicketReceipt';
