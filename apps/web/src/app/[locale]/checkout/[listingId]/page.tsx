import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';
import { prisma } from '@tixly/database';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ 
  params,
  searchParams,
}: { 
  params: { listingId: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  let listing = null;
  try {
    listing = await prisma.ticketListing.findUnique({
      where: { id: params.listingId },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
            stadium: true
          }
        }
      }
    });
  } catch (e) {
    console.error("DB error in checkout", e);
  }

  if (!listing) {
    notFound();
  }

  const isUpcoming = new Date(listing.match.kickoffUtc).getTime() > Date.now();

  if (!isUpcoming) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
            <div className="text-6xl mb-6 opacity-50">⏳</div>
            <h1 className="text-3xl font-bold text-tixNavy mb-4">Match Has Started</h1>
            <p className="text-gray-500 mb-8">Tickets for this match are no longer available for purchase.</p>
            <a href="/matches" className="bg-tixNavy text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition-colors">
              Browse Upcoming Matches
            </a>
          </div>
        </div>
      </main>
    );
  }

  // Pass down serialized listing data to the Client Component
  const listingData = {
    id: listing.id,
    pricePerTicket: listing.pricePerTicket,
    quantityAvailable: listing.quantity,
    section: listing.section,
    row: listing.row,
    category: listing.category,
    matchName: `${listing.match.homeTeam.name} vs ${listing.match.awayTeam.name}`,
    dateStr: new Date(listing.match.kickoffUtc).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    stadiumName: listing.match.stadium.name
  };

  const initialData = {
    qty: typeof searchParams.qty === 'string' ? parseInt(searchParams.qty) : 1,
    firstName: typeof searchParams.fn === 'string' ? searchParams.fn : '',
    lastName: typeof searchParams.ln === 'string' ? searchParams.ln : '',
    email: typeof searchParams.em === 'string' ? searchParams.em : '',
    redirectStatus: typeof searchParams.redirect_status === 'string' ? searchParams.redirect_status : null,
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-tixNavy mb-8">Secure Checkout</h1>
        <CheckoutFlow listing={listingData} initialData={initialData} />
      </div>
    </main>
  );
}
