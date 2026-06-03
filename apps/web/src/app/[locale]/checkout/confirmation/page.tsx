"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Ticket } from "lucide-react";
import { Link } from '@/navigation';
import { AnimatedTicket } from "@/components/ui/ticket-confirmation-card";

export default function CheckoutConfirmationPage() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get("orderRef") || "TIX-2026-12345678";
  
  // Mocks for display until connected to order data
  const mockAmount = 350.00;
  const mockDate = new Date("2026-06-11T16:00:00Z");

  return (
    <div className="container max-w-2xl py-16 mx-auto flex flex-col items-center">
      
      <div className="w-full flex justify-center mb-10">
        <AnimatedTicket
          ticketId={orderRef}
          amount={mockAmount}
          date={mockDate}
          cardHolder="Guest User"
          last4Digits="4242"
          barcodeValue={orderRef.replace(/[^0-9]/g, '') || "1234567890"}
        />
      </div>

      <div className="text-center space-y-6 max-w-md">
        <p className="text-muted-foreground text-slate-600">
          We've sent a confirmation email to your provided email address with your order details and instructions on how to access your tickets.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <Button asChild variant="outline" className="w-full sm:w-auto rounded-xl">
            <Link href="#">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto bg-brand-navy hover:bg-slate-800 text-white rounded-xl">
            <Link href="/">
              <Ticket className="w-4 h-4 mr-2" />
              Return to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
