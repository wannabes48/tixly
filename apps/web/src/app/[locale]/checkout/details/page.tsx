"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const locale = "en"; // Mock or retrieve from path
  
  const listingId = searchParams.get("listingId") || "mock-listing-1";
  const quantity = parseInt(searchParams.get("quantity") || "1", 10);

  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    createAccount: false,
  });

  const [ticketHolders, setTicketHolders] = useState(
    Array(quantity).fill({ firstName: "", lastName: "" })
  );

  const handleTicketHolderChange = (index: number, field: string, value: string) => {
    const newHolders = [...ticketHolders];
    newHolders[index] = { ...newHolders[index], [field]: value };
    setTicketHolders(newHolders);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const search = new URLSearchParams();
    search.set("listingId", listingId);
    search.set("quantity", quantity.toString());
    search.set("buyerName", formData.buyerName);
    search.set("buyerEmail", formData.buyerEmail);
    
    startTransition(() => {
      router.push(`/checkout/payment?${search.toString()}`);
    });
  };

  return (
    <div className="container max-w-3xl py-12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Checkout Details</CardTitle>
          <CardDescription>Enter your information to complete the purchase.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Buyer Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="buyerName">Full Name</Label>
                  <Input 
                    id="buyerName" 
                    required 
                    value={formData.buyerName}
                    onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerEmail">Email</Label>
                  <Input 
                    id="buyerEmail" 
                    type="email" 
                    required 
                    value={formData.buyerEmail}
                    onChange={(e) => setFormData({...formData, buyerEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="buyerPhone">Phone Number</Label>
                  <Input 
                    id="buyerPhone" 
                    type="tel" 
                    required 
                    value={formData.buyerPhone}
                    onChange={(e) => setFormData({...formData, buyerPhone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Ticket Holders</h3>
              {ticketHolders.map((holder, idx) => (
                <div key={idx} className="grid gap-4 p-4 border rounded-lg md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <p className="font-medium">Ticket #{idx + 1}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`firstName-${idx}`}>First Name</Label>
                    <Input 
                      id={`firstName-${idx}`} 
                      required 
                      value={holder.firstName}
                      onChange={(e) => handleTicketHolderChange(idx, "firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`lastName-${idx}`}>Last Name</Label>
                    <Input 
                      id={`lastName-${idx}`} 
                      required 
                      value={holder.lastName}
                      onChange={(e) => handleTicketHolderChange(idx, "lastName", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="createAccount" 
                checked={formData.createAccount}
                onCheckedChange={(checked) => setFormData({...formData, createAccount: checked as boolean})}
              />
              <Label htmlFor="createAccount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Create an account for faster checkout next time (Optional)
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" size="lg" className="w-full md:w-auto bg-brand-orange hover:bg-orange-600 text-white" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
