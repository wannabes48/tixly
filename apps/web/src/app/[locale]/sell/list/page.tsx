import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@tixly/database";
import ListTicketForm from "@/components/sell/ListTicketForm";

export const revalidate = 3600;

export default async function ListTicketPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/en/sell/list");
  }

  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } });
  
  if (user?.kycStatus !== "VERIFIED") {
    redirect("/en/sell/register");
  }

  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true
    },
    orderBy: { kickoffUtc: 'asc' }
  });

  const serializedMatches = matches.map(m => ({
    id: m.id,
    matchNumber: m.matchNumber,
    round: m.round,
    homeTeam: m.homeTeam.name,
    awayTeam: m.awayTeam.name,
    homeFlag: m.homeTeam.flagUrl,
    awayFlag: m.awayTeam.flagUrl,
    stadium: m.stadium.name,
    city: m.stadium.city,
    date: m.kickoffUtc.toISOString()
  }));

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">List Your Tickets</h1>
          <p className="text-slate-600">Provide the details of the tickets you want to sell.</p>
        </div>
        <ListTicketForm matches={serializedMatches} />
      </div>
    </div>
  );
}
