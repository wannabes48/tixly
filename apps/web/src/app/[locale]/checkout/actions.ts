"use server";

import { redirect } from "next/navigation";

export async function processPaymentAndCreateOrder(formData: FormData) {
  // Mock creating the order in Prisma
  const locale = formData.get("locale") as string || "en";
  const listingId = formData.get("listingId") as string;
  const quantity = formData.get("quantity") as string;
  const buyerName = formData.get("buyerName") as string;
  const buyerEmail = formData.get("buyerEmail") as string;
  const refundProtection = formData.get("refundProtection") === "true";

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate mock order reference
  const orderRef = `TIX-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;

  // Redirect to confirmation
  redirect(`/checkout/confirmation?orderRef=${orderRef}`);
}
