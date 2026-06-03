import {NextIntlClientProvider, useMessages} from 'next-intl';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '../../globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import { Analytics } from '@/components/Analytics';

import { Providers } from '@/components/Providers';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' });

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
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased text-brand-textblack bg-white">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <Navbar />
              <main>
                {children}
              </main>
              <Footer />
              <CookieBanner />
            </Providers>
          </NextIntlClientProvider>
          <Analytics />
      </body>
    </html>
  );
}
