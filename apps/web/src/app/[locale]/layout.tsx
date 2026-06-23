import {NextIntlClientProvider, useMessages} from 'next-intl';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '../../globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import { Analytics } from '@/components/Analytics';
import Script from 'next/script';

import { Providers } from '@/components/Providers';
import { Metadata } from 'next';
import { PostHogProvider } from '@/providers/PostHogProvider';
import PostHogPageView from '@/components/PostHogPageView';

const baseUrl = 'https://www.tixlyonline.com';
const locales = ['en', 'es', 'fr', 'pt', 'ar', 'de'];

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: {
      template: '%s | Tixly',
      default: 'Tixly | Official Secondary Ticket Marketplace for World Cup 2026',
    },
    description: 'Buy and sell tickets for the FIFA World Cup 2026 securely on Tixly.',
    metadataBase: new URL(baseUrl),
    robots: {
      index: true,
      follow: true,
    }
  };
}

import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

export default function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = useMessages();

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-8S6Z5BQMGC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-8S6Z5BQMGC');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased text-brand-textblack bg-transparent">
        <PostHogProvider>
          <PostHogPageView />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <AnimatedGradientBackground Breathing={true} containerClassName="fixed w-screen h-screen z-[-1]" />
              <Navbar />
              <main className="relative z-0">
                {children}
              </main>
              <Footer />
              <CookieBanner />
            </Providers>
          </NextIntlClientProvider>
        </PostHogProvider>
        {/* <Analytics /> component was intentionally removed to favor the direct head injection */}
      </body>
    </html>
  );
}
