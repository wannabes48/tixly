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
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-brand-navy mb-8">Secure Checkout</h1>
        <CheckoutFlow listing={listingData} initialData={initialData} />
      </div>
    </main>
  );
}
