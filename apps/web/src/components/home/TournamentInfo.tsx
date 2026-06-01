'use client';

const stats = [
  { number: '48', label: 'Teams' },
  { number: '104', label: 'Matches' },
  { number: '16', label: 'Cities' },
  { number: '16', label: 'Stadiums' },
  { number: '39', label: 'Days' },
];

const formatStages = [
  '12 groups of 4',
  'Top 2 + 8 best third-placed teams advance',
  'Round of 32',
  'Round of 16',
  'Quarter-Finals',
  'Semi-Finals',
  'Final',
];

export function TournamentInfo() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Football background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1920&q=80')",
        }}
      />
      {/* Dark navy overlay */}
      <div className="absolute inset-0 bg-brand-navy/90" />

      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          FIFA World Cup 2026™ at a Glance
        </h2>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 text-center transition-all duration-300 hover:bg-white/15 hover:scale-105"
            >
              <div className="text-5xl font-black text-brand-orange">
                {stat.number}
              </div>
              <div className="text-sm text-white/70 font-medium uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tournament format */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-semibold text-white mb-6 text-center">
            Tournament Format
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {formatStages.map((stage, index) => (
              <span key={index} className="flex items-center gap-2 md:gap-3">
                <span className="bg-white/10 rounded-full px-4 py-2 text-white font-medium text-sm md:text-base whitespace-nowrap transition-colors duration-200 hover:bg-white/20">
                  {stage}
                </span>
                {index < formatStages.length - 1 && (
                  <span className="text-brand-orange font-bold text-lg">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
