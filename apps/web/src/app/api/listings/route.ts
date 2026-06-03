import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@tixly/database";
import { z } from "zod";

const listingSchema = z.object({
  matchId: z.string().min(1),
  category: z.enum(["CAT1", "CAT2", "CAT3", "CAT4", "ACCESSIBILITY"]),
  section: z.string().optional(),
  row: z.string().optional(),
  quantity: z.number().int().min(1).max(10),
  pricePerTicket: z.number().min(50).max(10000),
  deliveryMethod: z.enum(["PDF_UPLOAD", "DELIVER_72H", "FIFA_APP"]),
  ticketFileUrl: z.string().optional(),
  notes: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify KYC status
    if (user.kycStatus !== "VERIFIED") {
      return NextResponse.json(
        { error: "Seller verification required. Please complete KYC via Stripe Connect." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = listingSchema.parse(body);

    if (data.deliveryMethod === "PDF_UPLOAD" && !data.ticketFileUrl) {
      return NextResponse.json({ error: "PDF ticket file is required for PDF_UPLOAD delivery method." }, { status: 400 });
    }

    // Create the listing
    const listing = await prisma.ticketListing.create({
      data: {
        matchId: data.matchId,
        sellerId: user.id,
        category: data.category,
        section: data.section || null,
        row: data.row || null,
        quantity: data.quantity,
        pricePerTicket: data.pricePerTicket,
        deliveryMethod: data.deliveryMethod,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, listingId: listing.id });
  } catch (error: any) {
    console.error("Listing Creation Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
