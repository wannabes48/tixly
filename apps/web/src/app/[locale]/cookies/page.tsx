'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Activity, Check, Save } from 'lucide-react';
import { useRouter } from '@/navigation';

export default function CookieSettingsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const consent = localStorage.getItem('tixly_cookie_consent');
    if (consent === 'granted') {
      setAnalyticsEnabled(true);
    } else {
      setAnalyticsEnabled(false);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('tixly_cookie_consent', analyticsEnabled ? 'granted' : 'denied');
    
    // Simulate short network delay for better UX
    setTimeout(() => {
      setIsSaving(false);
      window.location.reload(); // Reload to apply/remove scripts like Google Analytics
    }, 600);
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 mb-4 text-[#E8532A]">
            <Cookie className="w-6 h-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1A3C5E] mb-3 tracking-tight">
            Cookie Settings
          </h1>
          <p className="text-base text-slate-600 max-w-xl">
            Manage your cookie preferences. You can update these settings at any time. We use cookies to ensure the basic functionalities of the website and to enhance your online experience.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Essential Cookies (Always Required) */}
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-[#1A3C5E]">Strictly Necessary Cookies</h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Always Active</span>
              </div>
              <p className="text-sm text-slate-600">
                These cookies are essential for the website to function properly. They enable core functionalities such as security, network management, and user authentication. They cannot be disabled.
              </p>
            </div>
            <div className="flex-shrink-0">
              {/* Fake Toggle (Disabled On state) */}
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 cursor-not-allowed opacity-60">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white" />
              </div>
            </div>
          </div>

          {/* Analytics & Performance Cookies */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${analyticsEnabled ? 'bg-[#E8532A]/10 text-[#E8532A]' : 'bg-slate-100 text-slate-500'}`}>
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#1A3C5E] mb-1">Analytics & Performance</h3>
              <p className="text-sm text-slate-600">
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.
              </p>
            </div>
            <div className="flex-shrink-0">
              {/* Interactive Toggle */}
              <button 
                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8532A] focus:ring-offset-2 ${analyticsEnabled ? 'bg-[#E8532A]' : 'bg-slate-300'}`}
                role="switch"
                aria-checked={analyticsEnabled}
              >
                <span className="sr-only">Enable analytics cookies</span>
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${analyticsEnabled ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-8 flex items-center justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 bg-[#E8532A] hover:bg-[#d64a23] text-white font-bold text-sm py-3.5 px-8 rounded-xl transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
