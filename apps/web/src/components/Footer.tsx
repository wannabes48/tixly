import { useLocale } from "next-intl";
import { Link } from '@/navigation';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const footerColumns = [
  {
    title: 'Buyer Info',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/how-it-works', label: 'How it Works' },
      { href: '/buyer-protection', label: 'Buyer Protection' },
      { href: '/track-order', label: 'Track My Order' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact Us' },
    ],
  },
  {
    title: 'Seller Info',
    links: [
      { href: '/sell', label: 'Sell Tickets' },
      { href: '/seller-faq', label: 'Seller FAQ' },
      { href: '/seller-payouts', label: 'Seller Payouts' },
      { href: '/legal/seller-agreement', label: 'Seller Terms' },
    ],
  },
  {
    title: 'Legal & Support',
    links: [
      { href: '/legal/terms', label: 'Terms & Conditions' },
      { href: '/legal/privacy', label: 'Privacy Policy' },
      { href: '/cookies', label: 'Cookie Settings' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Linkedin, label: 'LinkedIn' },
];

const paymentMethods = [
  'Visa',
  'Mastercard',
  'Amex',
  'PayPal',
  'Apple Pay',
  'Google Pay',
];

export function Footer() {
  const locale = useLocale();

  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer */}
      <div className="max-w-content mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* About Tixly */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Logo size="md" variant="light" showText={true} />
            </Link>
            <p className="text-brand-mutedgrey text-sm leading-relaxed mb-6 max-w-xs">
              The official secondary marketplace for FIFA World Cup 2026™
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href={`https://${label.toLowerCase()}.com/tixly`}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-100 hover:bg-brand-navy hover:text-white text-gray-500 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-brand-navy font-bold text-sm mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-brand-mutedgrey hover:text-brand-orange text-sm transition-colors font-medium"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-100">
          {/* Payment methods */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-500 text-xs font-semibold rounded-md border border-gray-100"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-400">
            <p>© {year} Tixly LLC. All rights reserved. | Business Reg: TXL-2026-9081</p>
            <p>
              Tixly is a secondary marketplace. Prices may differ from face
              value.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
