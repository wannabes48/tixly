import {NextIntlClientProvider, useMessages} from 'next-intl';
import {Inter} from 'next/font/google';
import '../../globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import { Analytics } from '@/components/Analytics';

import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

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
