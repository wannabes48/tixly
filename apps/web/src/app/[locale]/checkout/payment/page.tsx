"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { processPaymentAndCreateOrder } from "../actions";

export default function CheckoutPaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || "en";
  
  const quantity = parseInt(searchParams.get("quantity") || "1", 10);
  const buyerName = searchParams.get("buyerName") || "Guest";
  const buyerEmail = searchParams.get("buyerEmail") || "guest@example.com";
  
  const pricePerTicket = 150.0;
  const subtotal = pricePerTicket * quantity;
  const serviceFee = subtotal * 0.10; // 10% transparent service fee
  
  const [refundProtection, setRefundProtection] = useState(false);
  const refundProtectionFee = refundProtection ? 15.0 * quantity : 0;
  
  const total = subtotal + serviceFee + refundProtectionFee;

  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="container grid gap-8 py-12 mx-auto md:grid-cols-3 max-w-6xl">
      <div className="space-y-6 md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Payment Details</CardTitle>
            <CardDescription>Enter your payment information below. (Mock Stripe Form)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Card Information</Label>
              <div className="p-4 border rounded-md bg-muted/50 text-muted-foreground flex items-center justify-center h-24">
                <span className="text-sm">Mock Stripe Payment Element would render here</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Name on Card</Label>
              <Input placeholder="John Doe" defaultValue={buyerName} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              Refund Protection
              <span className="px-2 py-1 text-xs text-primary-foreground bg-primary rounded-full">Recommended</span>
            </CardTitle>
            <CardDescription>
              Protect your purchase in case you can't attend due to illness, transport failure, or other covered reasons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="refundProtection" 
                checked={refundProtection}
                onCheckedChange={(checked) => setRefundProtection(checked as boolean)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="refundProtection" className="font-medium cursor-pointer">
                  Yes, add Refund Protection for ${15.0 * quantity}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Highly recommended for peace of mind.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{quantity} x Match Ticket</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Fee (10%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            {refundProtection && (
              <div className="flex justify-between text-sm text-primary">
                <span>Refund Protection</span>
                <span>${refundProtectionFee.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-4 mt-4 border-t flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <form action={processPaymentAndCreateOrder} onSubmit={() => setIsProcessing(true)}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="quantity" value={quantity.toString()} />
              <input type="hidden" name="buyerName" value={buyerName} />
              <input type="hidden" name="buyerEmail" value={buyerEmail} />
              <input type="hidden" name="refundProtection" value={refundProtection.toString()} />
              <Button type="submit" className="w-full mt-6 bg-brand-orange hover:bg-orange-600 text-white" size="lg" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay Now $${total.toFixed(2)}`
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground text-center">
            By clicking "Pay Now", you agree to our Terms of Service and Privacy Policy. No login required.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
