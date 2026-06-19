import { redirect } from 'next/navigation';
import { prisma } from '@tixly/database';
import { GuestCheckoutForm } from '@/components/checkout/GuestCheckoutForm';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const listingId = typeof searchParams.listingId === 'string' ? searchParams.listingId : null;
  const matchId = typeof searchParams.matchId === 'string' ? searchParams.matchId : null;
  const qtyParam = typeof searchParams.qty === 'string' ? searchParams.qty : null;

  if (!listingId || !matchId || !qtyParam) {
    redirect('/');
  }

  const qty = parseInt(qtyParam);

  // Server-side validation
  const listing = await prisma.ticketListing.findUnique({
    where: { id: listingId },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
        }
      }
    }
  });

  if (!listing || listing.status !== 'ACTIVE' || listing.quantity < qty) {
    redirect(`/matches/${matchId}?error=listing_unavailable`);
  }

  // Create Optimistic Lock
  const sessionId = 'guest-' + Math.random().toString(36).substring(7);
  
  try {
    await prisma.ticketHold.create({
      data: {
        listingId: listing.id,
        sessionId,
        quantity: qty,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      }
    });
  } catch (error) {
    console.error("Failed to acquire lock:", error);
    redirect(`/matches/${matchId}?error=listing_unavailable`);
  }

  const subtotal = listing.pricePerTicket * qty;
  const serviceFee = subtotal * 0.15; // 15% fee
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#f9fafb]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-tixNavy">Secure Checkout</h1>
          <p className="text-gray-500">Your tickets are held for 10:00 minutes.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-soft">
            <h2 className="text-xl font-bold text-tixNavy mb-6">Guest Information</h2>
            <GuestCheckoutForm listingId={listing.id} qty={qty} sessionId={sessionId} />
          </div>

          <aside className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft sticky top-24">
              <h3 className="font-bold text-tixNavy mb-4">Order Summary</h3>
              
              <div className="pb-4 border-b border-gray-100 mb-4">
                <div className="font-bold text-tixNavy">{listing.match.homeTeam.name} vs {listing.match.awayTeam.name}</div>
                <div className="text-sm text-gray-500">{listing.category} · {listing.section || 'General Admission'} · {listing.row || 'Row TBD'}</div>
                <div className="text-sm text-gray-500 mt-1">{qty} {qty === 1 ? 'ticket' : 'tickets'}</div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tickets ({qty} × ${listing.pricePerTicket})</span>
                  <span className="font-medium text-tixNavy">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium text-tixNavy">${serviceFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-tixNavy">Total</span>
                <span className="text-2xl font-black text-tixNavy">${total.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
