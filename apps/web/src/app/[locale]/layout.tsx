import {NextIntlClientProvider, useMessages} from 'next-intl';
import {Inter} from 'next/font/google';
import '../../globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import { Analytics } from '@/components/Analytics';

import { Providers } from '@/components/Providers';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const baseUrl = 'https://www.tixlyonline.com';
const locales = ['en', 'es', 'fr', 'pt', 'ar', 'de'];

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[l] = `/${l}`; // Relative paths for alternates
  });

  return {
    title: {
      template: '%s | Tixly',
      default: 'Tixly | Official Secondary Ticket Marketplace for World Cup 2026',
    },
    description: 'Buy and sell tickets for the FIFA World Cup 2026 securely on Tixly.',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: languages,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <Navbar />
              {children}
              <Footer />
              <CookieBanner />
            </Providers>
          </NextIntlClientProvider>
          <Analytics />
      </body>
    </html>
  );
}
