import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@tixly/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/navigation";
import { Banknote, Clock, Star, Edit, Trash2 } from "lucide-react";

export const revalidate = 0;

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/en/sell/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: {
      listings: {
        include: { match: { include: { homeTeam: true, awayTeam: true } } },
        orderBy: { id: 'desc' }
      }
    }
  });

  if (!user || user.kycStatus !== "VERIFIED") {
    redirect("/en/sell/register");
  }

  // Aggregate stats
  const activeListings = user.listings.filter(l => l.status === "ACTIVE");
  const soldListings = user.listings.filter(l => l.status === "SOLD");

  // Since we don't have a direct "revenue" field easily calculated without Order table,
  // we'll fetch orders where listing.sellerId === user.id
  const orders = await prisma.order.findMany({
    where: { listing: { sellerId: user.id } },
    include: { listing: { include: { match: { include: { homeTeam: true, awayTeam: true } } } } },
    orderBy: { createdAt: 'desc' }
  });

  const totalRevenue = orders.reduce((sum, order) => {
    // Seller gets subtotal (pricePerTicket * quantity) minus 10% commission
    return sum + (order.subtotal * 0.9);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Seller Dashboard</h1>
            <p className="text-slate-500">Manage your ticket listings and payouts.</p>
          </div>
          <Link href="/sell/list" className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl inline-flex items-center text-sm shadow-md transition-all">
            <img src="/ticket.png" alt="Ticket" className="w-4 h-4 mr-2 object-contain" /> List New Tickets
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><Banknote className="w-5 h-5" /></div>
              </div>
              <p className="text-sm font-semibold text-slate-500">Total Earnings</p>
              <h3 className="text-2xl font-black text-brand-navy">${totalRevenue.toFixed(2)}</h3>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 text-brand-midblue rounded-full flex items-center justify-center"><img src="/ticket.png" alt="Ticket" className="w-5 h-5 object-contain" /></div>
              </div>
              <p className="text-sm font-semibold text-slate-500">Active Listings</p>
              <h3 className="text-2xl font-black text-brand-navy">{activeListings.length}</h3>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center"><Clock className="w-5 h-5" /></div>
              </div>
              <p className="text-sm font-semibold text-slate-500">Tickets Sold</p>
              <h3 className="text-2xl font-black text-brand-navy">{soldListings.reduce((sum, l) => sum + l.quantity, 0)}</h3>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center"><Star className="w-5 h-5 fill-current" /></div>
              </div>
              <p className="text-sm font-semibold text-slate-500">Seller Rating</p>
              <h3 className="text-2xl font-black text-brand-navy">5.0</h3>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100 flex overflow-x-auto">
            <button className="px-6 py-4 font-bold text-brand-orange border-b-2 border-brand-orange whitespace-nowrap">
              Active Listings ({activeListings.length})
            </button>
            <button className="px-6 py-4 font-semibold text-slate-500 hover:text-brand-navy whitespace-nowrap transition-colors">
              Sold Orders ({orders.length})
            </button>
          </div>

          <div className="p-6">
            {activeListings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4"><img src="/ticket.png" alt="Ticket" className="w-8 h-8 object-contain" /></div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">No active listings</h3>
                <p className="text-slate-500 mb-6">You don't have any tickets listed for sale right now.</p>
                <Link href="/sell/list" className="text-brand-orange font-semibold hover:underline">Create a listing →</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-sm text-slate-500">
                      <th className="pb-3 font-semibold">Match</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Price</th>
                      <th className="pb-3 font-semibold">Qty</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeListings.map(listing => (
                      <tr key={listing.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="font-bold text-brand-navy">{listing.match.homeTeam.name} vs {listing.match.awayTeam.name}</div>
                          <div className="text-xs text-slate-500">{new Date(listing.match.kickoffUtc).toLocaleDateString()}</div>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-brand-paleblue text-brand-navy">
                            {listing.category}
                          </span>
                        </td>
                        <td className="py-4 font-bold text-brand-navy">${listing.pricePerTicket}</td>
                        <td className="py-4 text-slate-600">{listing.quantity}</td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-slate-400 hover:text-brand-midblue rounded-lg hover:bg-brand-paleblue transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
