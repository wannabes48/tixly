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

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <TrustBar />
      <MatchCarousel />
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
