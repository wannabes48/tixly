"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, Ticket } from "lucide-react";
import { Link } from '@/navigation';

export default function CheckoutConfirmationPage() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get("orderRef") || "TIX-2026-12345678";

  return (
    <div className="container max-w-2xl py-16 mx-auto">
      <Card className="text-center border-green-500/20 shadow-lg shadow-green-500/10">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Payment Successful!</CardTitle>
          <CardDescription className="text-lg">
            Your tickets for the FIFA World Cup 2026 have been confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Order Reference</p>
            <p className="text-2xl font-mono font-bold tracking-wider">{orderRef}</p>
          </div>
          <p className="text-muted-foreground">
            We've sent a confirmation email to your provided email address with your order details and instructions on how to access your tickets.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row justify-center">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="#">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt PDF
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              <Ticket className="w-4 h-4 mr-2" />
              Return to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
