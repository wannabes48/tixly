'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/navigation';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('tixly_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('tixly_cookie_consent', 'granted');
    setIsVisible(false);
    // Reload to apply scripts if they were blocked
    window.location.reload();
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem('tixly_cookie_consent', 'denied');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl p-3 md:p-4 transform transition-transform duration-500 ease-in-out">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        <div className="flex-1">
          <h3 className="text-base font-bold text-brand-navy mb-1">We value your privacy</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. To learn more, read our <Link href="/legal/privacy" className="text-brand-orange hover:underline font-medium">Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
          <button
            onClick={handleRejectNonEssential}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 rounded-lg bg-brand-orange text-white text-xs font-bold hover:bg-orange-600 shadow-sm transition-colors w-full sm:w-auto"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
