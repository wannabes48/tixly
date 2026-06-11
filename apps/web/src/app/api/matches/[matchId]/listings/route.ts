import { NextResponse } from 'next/server';
import { prisma } from '@tixly/database';

export const revalidate = 300; // Cache listings API with stale-while-revalidate for 5 minutes

export async function GET(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  const { searchParams } = new URL(request.url);
  const quantityParam = searchParams.get('quantity');
  const categoryParam = searchParams.get('category');
  
  const quantity = quantityParam ? parseInt(quantityParam) : 1;

  try {
    const match = await prisma.match.findUnique({
      where: { id: params.matchId },
      select: { kickoffUtc: true }
    });

    if (!match || new Date(match.kickoffUtc).getTime() <= Date.now()) {
      return NextResponse.json({
        listings: [],
        categoryCounts: { 'CAT1': 0, 'CAT2': 0, 'CAT3': 0, 'CAT4': 0, 'ACCESSIBILITY': 0 }
      });
    }

    // Determine which categories are valid
    const allListings = await prisma.ticketListing.findMany({
      where: {
        matchId: params.matchId,
        status: 'ACTIVE',
        quantity: { gte: quantity },
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            kycStatus: true,
            // Mocking these properties down below since they don't exist on User schema
          }
        }
      },
      orderBy: { pricePerTicket: 'asc' },
    });

    // Calculate category counts
    const categoryCounts: Record<string, number> = {
      'CAT1': 0, 'CAT2': 0, 'CAT3': 0, 'CAT4': 0, 'ACCESSIBILITY': 0
    };

    allListings.forEach(l => {
      if (categoryCounts[l.category] !== undefined) {
        categoryCounts[l.category]++;
      }
    });

    // Filter by selected category if provided
    let filteredListings = allListings;
    if (categoryParam && categoryParam !== 'All') {
      filteredListings = allListings.filter(l => l.category === categoryParam);
    }

    // Mock seller profiles dynamically based on sellerId
    const mappedListings = filteredListings.map(listing => {
      // Create a deterministic hash from sellerId
      const charSum = listing.sellerId ? listing.sellerId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) : 0;
      const mockRating = 4.0 + ((charSum % 10) / 10); // Between 4.0 and 4.9
      const mockSales = 10 + (charSum % 200);

      // Extract first name and last initial
      let sellerName = listing.seller?.name || 'Anonymous User';
      const parts = sellerName.split(' ');
      if (parts.length > 1) {
        sellerName = `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
      }

      return {
        ...listing,
        seller: {
          ...listing.seller,
          name: sellerName,
          avgRating: mockRating.toFixed(1),
          totalSales: mockSales
        }
      };
    });

    return NextResponse.json({
      listings: mappedListings,
      categoryCounts
    });

  } catch (error) {
    console.error('API Error in listings route:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}
