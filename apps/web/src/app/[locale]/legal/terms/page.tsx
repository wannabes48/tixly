import { Link } from '@/navigation';

export const metadata = {
  title: 'Terms and Conditions | Tixly',
  description: 'Terms and conditions for buying and selling on the Tixly marketplace.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-gray-100">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-brand-navy mb-4">Terms & Conditions</h1>
            <p className="text-gray-500">Last Updated: May 31, 2026</p>
          </div>

          <div className="text-base text-gray-600 space-y-6">
            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">1. Introduction</h2>
            <p>
              Welcome to Tixly ("we," "our," or "us"). By accessing or using our platform to buy or sell secondary market tickets for the FIFA World Cup 2026™ ("Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Platform.
            </p>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">2. Tixly as a Marketplace</h2>
            <p>
              Tixly operates as an independent ticket marketplace. We are <strong className="font-semibold text-brand-navy">not</strong> officially affiliated with FIFA, the organizing committees, or any official federations. We act as an intermediary connecting ticket buyers with independent sellers. Prices are set by sellers and may be above or below the original "face value."
            </p>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">3. Buyer Guarantee</h2>
            <p>
              We provide a 100% Buyer Guarantee for all transactions on Tixly:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-base">
              <li>You will receive valid tickets in time for the event.</li>
              <li>Your tickets will provide valid entry to the event.</li>
              <li>If any of the above fails, you will receive a full refund or comparable replacement tickets.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">4. Purchasing Tickets</h2>
            <p>
              All sales are final. Because tickets are unique, once an order is confirmed, we cannot process cancellations or exchanges unless the event is outright canceled and not rescheduled.
            </p>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">5. Event Cancellations and Postponements</h2>
            <p>
              If a match is canceled and not rescheduled, you will receive a full refund. If a match is postponed, your tickets will typically remain valid for the rescheduled date, and refunds are not guaranteed unless specifically authorized by the event organizers.
            </p>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">6. Liability</h2>
            <p>
              Tixly is not responsible for any personal injuries, property damage, or travel expenses incurred in connection with an event. Our maximum liability to any buyer is limited to the total amount paid for the tickets.
            </p>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">7. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, USA, without regard to its conflict of law provisions.
            </p>

            <hr className="my-10 border-gray-200" />
            
            <p className="text-sm text-gray-500 italic text-center">
              For questions regarding these Terms, please <Link href="/contact" className="font-semibold text-[#E8532A] hover:underline">contact us</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
