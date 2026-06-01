import { Link } from '@/navigation';

export const metadata = {
  title: 'Seller Agreement | Tixly',
  description: 'Terms of Service for independent sellers on the Tixly platform.',
};

export default function SellerAgreementPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-gray-100">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-brand-navy tracking-tight mb-4">Seller Agreement</h1>
            <p className="text-gray-500">Effective Date: May 31, 2026</p>
          </div>

          <div className="prose prose-gray max-w-none prose-headings:text-brand-navy prose-a:text-brand-orange hover:prose-a:text-orange-600">
            <h2>1. Listing Tickets</h2>
            <p>
              By listing tickets on Tixly, you ("Seller") guarantee that you have the right to transfer the tickets, and that the tickets are authentic. You must accurately describe the seat location, category, and any restrictions (e.g., obstructed view, age limits).
            </p>

            <h2>2. Pricing and Fees</h2>
            <p>
              Sellers set their own listing prices. Tixly charges a seller fee (commission) on the final sale price, which is deducted prior to your payout. The fee percentage is displayed during the listing process.
            </p>

            <h2>3. Fulfilling Orders</h2>
            <p>
              Once a buyer purchases your tickets, you are legally bound to fulfill the order. For mobile transfers, you must transfer the tickets to the buyer's provided email address within the required timeframe (typically 48 hours before kickoff).
            </p>

            <h2>4. Dropped Sales & Penalties</h2>
            <p>
              If you fail to fulfill an order, provide invalid tickets, or cancel a sale, you will be subject to severe penalties:
            </p>
            <ul>
              <li>You will not be paid for the sale.</li>
              <li>You will be charged a penalty fee equal to 150% of the original listing price to cover the cost of sourcing replacement tickets for the buyer.</li>
              <li>Your account may be permanently suspended from the Tixly platform.</li>
            </ul>

            <h2>5. Payout Schedule</h2>
            <p>
              To protect buyers and prevent fraud, Tixly holds seller funds in escrow. You will be paid approximately 5 to 8 business days <strong>after</strong> the event has successfully taken place. Payments are issued via ACH, wire transfer, or PayPal.
            </p>

            <h2>6. Event Cancellations</h2>
            <p>
              If an event is canceled entirely, the sale is voided. You will not be paid, and you must refund any advance payments. You will retain ownership of the original tickets to claim a refund from the primary issuer.
            </p>

            <hr className="my-10 border-gray-200" />
            
            <p className="text-sm text-gray-500 italic text-center">
              Ready to sell? <Link href="/sell" className="font-semibold underline">Go to the Seller Portal</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
