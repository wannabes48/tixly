import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@tixly/database';
import UsersClient from './UsersClient';
import { getTranslations } from 'next-intl/server';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/login');
  }

  const t = await getTranslations('Admin');

  // Fetch all users with their connected accounts
  const users = await prisma.user.findMany({
    include: {
      accounts: {
        select: {
          provider: true
        }
      }
    },
    orderBy: {
      id: 'desc'
    }
  });

  // Fetch ticket holds
  const holds = await prisma.ticketHold.findMany({
    include: {
      listing: {
        include: {
          match: {
            include: {
              homeTeam: { select: { name: true, flagUrl: true } },
              awayTeam: { select: { name: true, flagUrl: true } },
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-navy tracking-tight">Users & Holds</h1>
          <p className="text-slate-500 mt-1">Platform observability for registered accounts and ticket holds.</p>
        </div>
      </div>

      <UsersClient 
        users={users.map(u => ({
          ...u,
          // accounts might have multiple, we map it
        }))} 
        holds={holds.map(h => ({
          id: h.id,
          sessionId: h.sessionId,
          buyerFirstName: h.buyerFirstName,
          buyerLastName: h.buyerLastName,
          buyerEmail: h.buyerEmail,
          buyerPhone: h.buyerPhone,
          quantity: h.quantity,
          createdAt: h.createdAt.toISOString(),
          expiresAt: h.expiresAt.toISOString(),
          listing: {
            category: h.listing.category,
            pricePerTicket: h.listing.pricePerTicket,
            match: {
              homeTeam: {
                name: h.listing.match.homeTeam.name,
                flagUrl: h.listing.match.homeTeam.flagUrl
              },
              awayTeam: {
                name: h.listing.match.awayTeam.name,
                flagUrl: h.listing.match.awayTeam.flagUrl
              }
            }
          }
        }))} 
      />
    </div>
  );
}
