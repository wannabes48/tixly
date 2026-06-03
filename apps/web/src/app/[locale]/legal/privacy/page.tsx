import { Link } from '@/navigation';

export const metadata = {
  title: 'Privacy Policy | Tixly',
  description: 'Tixly Privacy Policy covering data collection, GDPR, and CCPA compliance.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-gray-100">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-brand-navy mb-4">Privacy Policy</h1>
            <p className="text-gray-500">Effective Date: May 31, 2026</p>
          </div>

          <div className="text-base text-gray-600 space-y-6">
            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">1. Information We Collect</h2>
            <p>
              At Tixly, we collect information to provide a seamless marketplace experience. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-base">
              <li><strong className="font-semibold text-brand-navy">Personal Data:</strong> Name, email address, billing/shipping address, and phone number when you create an account or checkout.</li>
              <li><strong className="font-semibold text-brand-navy">Payment Data:</strong> Handled securely via our PCI-compliant partners (e.g., Stripe). We do not store full credit card details.</li>
              <li><strong className="font-semibold text-brand-navy">Usage Data:</strong> Device information, IP address, and interaction data via cookies to improve site performance.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">2. How We Use Your Data</h2>
            <p>
              Your data is used strictly to process orders, facilitate ticket transfers, prevent fraud, and comply with legal obligations. With your explicit consent, we may also send you marketing communications.
            </p>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">3. Information Sharing</h2>
            <p>
              We only share your information with trusted third parties necessary to process your transaction (e.g., payment gateways, ticket sellers for transfer purposes). We <strong className="font-semibold text-brand-navy">never</strong> sell your personal data to advertisers.
            </p>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">4. GDPR & CCPA Compliance</h2>
            <p>
              If you are a resident of the European Economic Area (EEA), the UK, or California, you have the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-base">
              <li>The right to access the personal data we hold about you.</li>
              <li>The right to request correction or deletion of your data ("Right to be Forgotten").</li>
              <li>The right to opt-out of the "sale" of personal data (Note: We do not sell data).</li>
              <li>The right to restrict or object to processing.</li>
            </ul>
            <p>
              To exercise these rights, please email our Data Protection Officer at <a href="mailto:privacy@tixly.example.com" className="font-semibold text-[#E8532A] hover:underline">privacy@tixly.example.com</a>.
            </p>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">5. Cookies and Tracking</h2>
            <p>
              We use cookies to ensure basic platform functionality and to analyze traffic. You can manage your preferences at any time using our Cookie Consent Banner or via your browser settings.
            </p>

            <h2 className="text-2xl font-semibold text-brand-navy mt-10 mb-4">6. Data Security</h2>
            <p>
              We implement robust security measures including encryption in transit and at rest. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
            </p>

            <hr className="my-10 border-gray-200" />
            
            <p className="text-sm text-gray-500 italic text-center">
              If you have questions about this Privacy Policy, please <Link href="/contact" className="font-semibold text-[#E8532A] hover:underline">contact our Privacy Team</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
