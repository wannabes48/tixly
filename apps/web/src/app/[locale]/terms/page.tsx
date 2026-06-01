export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-16">
          <h1 className="text-5xl font-extrabold text-brand-navy mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-500">Last Updated: May 31, 2026</p>
        </div>

        <div className="prose prose-lg prose-slate max-w-none text-slate-700 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Tixly platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all the terms and conditions, you may not access the Platform or use any of its services. Tixly is a ticket marketplace that allows users to buy and sell tickets for the FIFA World Cup 2026™.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">2. Tixly as a Marketplace</h2>
            <p>
              Tixly acts purely as an intermediary connecting buyers and sellers. We do not own the tickets sold on our Platform. While we provide the 100% Buyer Guarantee, pricing is set by sellers and may be higher or lower than the face value of the ticket.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">3. User Accounts</h2>
            <p>
              To use certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate. You are responsible for safeguarding your password and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">4. Buying Tickets</h2>
            <p>
              When purchasing a ticket, you are entering into a binding contract with the seller. All sales are final. Refunds are only issued in accordance with our 100% Buyer Guarantee (e.g., if the event is cancelled and not rescheduled, or if the tickets are invalid). 
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">5. Selling Tickets</h2>
            <p>
              Sellers must accurately describe their tickets. If a seller fails to deliver the exact tickets listed (or comparable/better alternatives approved by the buyer), Tixly reserves the right to cancel the sale, charge the seller a replacement fee, and suspend or terminate the seller's account. Payouts to sellers are typically processed after the event has occurred to ensure ticket validity.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">6. Code of Conduct</h2>
            <p>
              Users agree not to use the Platform for any unlawful purpose, to solicit others to perform or participate in any unlawful acts, or to violate any international, federal, or state regulations, rules, or laws. Fraudulent activity will be reported to the relevant law enforcement authorities.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">7. Changes to Terms</h2>
            <p>
              Tixly reserves the right, at our sole discretion, to update, change or replace any part of these Terms by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
