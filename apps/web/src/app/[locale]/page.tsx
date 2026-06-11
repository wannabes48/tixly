import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import MatchCarousel from '@/components/home/MatchCarousel';
import TeamGrid from '@/components/home/TeamGrid';
import CityGrid from '@/components/home/CityGrid';
import TicketCategories from '@/components/home/TicketCategories';
import HowItWorks from '@/components/home/HowItWorks';
import { BuyerProtection } from '@/components/home/BuyerProtection';
import { TournamentInfo } from '@/components/home/TournamentInfo';
import { FAQ } from '@/components/home/FAQ';
import { prisma } from '@tixly/database';
import { format } from 'date-fns';

export default async function HomePage() {
  const dbMatches = await prisma.match.findMany({
    orderBy: { kickoffUtc: 'asc' },
    take: 6,
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
      listings: {
        orderBy: { pricePerTicket: 'asc' },
        take: 1
      }
    }
  });

  const matches = dbMatches.map((m: any) => ({
    id: m.id,
    date: format(new Date(m.kickoffUtc), 'MMM dd · EEE').toUpperCase(),
    dateShort: format(new Date(m.kickoffUtc), 'yyyy-MM-dd'),
    homeTeam: m.homeTeam?.name || 'TBD',
    homeFlagUrl: m.homeTeam?.flagUrl || 'https://flagcdn.com/w320/un.png',
    awayTeam: m.awayTeam?.name || 'TBD',
    awayFlagUrl: m.awayTeam?.flagUrl || 'https://flagcdn.com/w320/un.png',
    stadium: m.stadium?.name || 'TBA',
    city: m.stadium?.city || 'TBA',
    priceFrom: m.listings?.[0]?.pricePerTicket || 150,
    kickoffUtc: m.kickoffUtc.toISOString(),
  }));

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <TrustBar />
      <MatchCarousel matches={matches} />
      <TeamGrid />
      <CityGrid />
      <TicketCategories />
      <HowItWorks />
      <BuyerProtection />
      <TournamentInfo />
      <FAQ />
    </main>
  );
}
