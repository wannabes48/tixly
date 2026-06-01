'use client';
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from '@/navigation';
import { useEffect, useState, useRef } from 'react';
import { Menu, X, ChevronDown, Globe, DollarSign } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useSession, signOut } from 'next-auth/react';

const navLinks = [
  { href: '/matches', label: 'Matches' },
  { href: '/teams', label: 'Teams' },
  { href: '/cities', label: 'Cities' },
  { href: '/stadiums', label: 'Stadiums' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/sell', label: 'Sell Tickets' },
];

const currencies = ['USD', 'EUR', 'GBP', 'MXN', 'CAD'];
const languages = ['EN', 'ES', 'FR', 'DE', 'PT'];

export function Navbar() {
  const { data: session } = useSession();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLanguage, setSelectedLanguage] = useState(locale.toUpperCase());

  useEffect(() => {
    const savedCurrency = localStorage.getItem('tixly_currency');
    if (savedCurrency) setSelectedCurrency(savedCurrency);
  }, []);

  const handleLanguageChange = (l: string) => {
    setSelectedLanguage(l);
    setLanguageOpen(false);
    router.replace(pathname, { locale: l.toLowerCase() as any });
  };

  const handleCurrencyChange = (c: string) => {
    setSelectedCurrency(c);
    setCurrencyOpen(false);
    localStorage.setItem('tixly_currency', c);
  };

  const currencyRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isSolid = !isHome || scrolled;

  if (pathname === '/sign-in') return null;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 h-16 ${
          isSolid
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-content mx-auto px-4 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Logo size="sm" variant={isSolid ? 'light' : 'dark'} />
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-black/5 ${
                  isSolid
                    ? 'text-gray-700 hover:text-brand-navy'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Currency Selector */}
            <div ref={currencyRef} className="relative hidden md:block">
              <button
                onClick={() => {
                  setCurrencyOpen(!currencyOpen);
                  setLanguageOpen(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-black/5 ${
                  isSolid ? 'text-gray-600' : 'text-white/85'
                }`}
              >
                <DollarSign size={14} />
                <span>{selectedCurrency}</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform ${currencyOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {currencyOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-28 bg-white rounded-lg shadow-card-hover border border-gray-100 py-1 z-50">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCurrencyChange(c)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-brand-paleblue ${
                        c === selectedCurrency
                          ? 'text-brand-navy font-semibold bg-brand-paleblue'
                          : 'text-gray-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div ref={languageRef} className="relative hidden md:block">
              <button
                onClick={() => {
                  setLanguageOpen(!languageOpen);
                  setCurrencyOpen(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-black/5 ${
                  isSolid ? 'text-gray-600' : 'text-white/85'
                }`}
              >
                <Globe size={14} />
                <span>{selectedLanguage}</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform ${languageOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {languageOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-24 bg-white rounded-lg shadow-card-hover border border-gray-100 py-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLanguageChange(l)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-brand-paleblue ${
                        l === selectedLanguage
                          ? 'text-brand-navy font-semibold bg-brand-paleblue'
                          : 'text-gray-600'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sign In / User Profile */}
            {session ? (
              <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={() => signOut()}
                  className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-black/5 ${
                    isSolid ? 'text-gray-700' : 'text-white/90'
                  }`}
                >
                  Sign Out
                </button>
                <div className="w-9 h-9 bg-brand-orange text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white/20">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className={`hidden md:block text-sm font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-black/5 ${
                  isSolid ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Sell Tickets CTA */}
            <Link
              href="/sell"
              className="bg-brand-orange hover:bg-orange-600 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-button transition-all"
            >
              Sell Tickets
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-black/5 ${
                isSolid ? 'text-gray-700' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white shadow-modal transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Logo size="sm" variant="light" />
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer body */}
          <div className="overflow-y-auto h-[calc(100%-64px)] hide-scrollbar">
            <nav className="flex flex-col px-4 py-4 gap-0.5">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 text-brand-navy font-semibold rounded-xl hover:bg-brand-paleblue transition-colors text-[15px]"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-100 mx-4" />

            {/* Currency & Language in mobile */}
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign size={14} />
                  <span className="font-medium">Currency</span>
                </div>
                <select
                  value={selectedCurrency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-brand-navy outline-none cursor-pointer"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe size={14} />
                  <span className="font-medium">Language</span>
                </div>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-brand-navy outline-none cursor-pointer"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 mx-4" />

            <div className="px-4 py-4 space-y-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3 text-brand-navy font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
              >
                Sign In
              </Link>
              <Link
                href="/sell"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
              >
                Sell Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
