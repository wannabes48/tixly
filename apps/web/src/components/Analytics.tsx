'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export function Analytics() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('tixly_cookie_consent');
    if (consent === 'granted') {
      setConsentGranted(true);
    }
  }, []);

  if (!consentGranted) {
    // If not granted, we block non-essential scripts entirely.
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-8S6Z5BQMGC`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8S6Z5BQMGC', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
