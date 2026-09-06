'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useI18n } from '@/lib/i18n-context';
import { Menu, Search, ShoppingBag, Phone, Sparkles, MessageCircle, Globe } from 'lucide-react';
import { CategoryDrawer } from './CategoryDrawer';

interface AppTopBarProps {
  categories?: {
    id: string;
    name: string;
    slug: string;
    children?: { id: string; name: string; slug: string }[];
  }[];
}

export function AppTopBar({ categories = [] }: AppTopBarProps) {
  const { totalCount, totalEstimate, setIsCartDrawerOpen } = useCart();
  const { language, setLanguage, t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80'
            : 'bg-white border-b border-slate-100'
          }`}
      >
        {/* Top utility bar on desktop */}
        <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs py-1.5 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                {t('brandTagline')}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-medium">
                🌱 {t('safeGreenCrackers')}
              </span>
            </div>
            <div className="flex items-center gap-4 font-medium">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold transition"
                title="Switch Language / மொழியை மாற்றவும்"
              >
                <Globe className="w-3 h-3 text-amber-300" />
                <span>{language === 'en' ? 'தமிழ் (TA)' : 'English (EN)'}</span>
              </button>

              <a
                href="tel:+916369401248"
                className="hover:text-white flex items-center gap-1 transition"
              >
                <Phone className="w-3 h-3 text-red-400" />
                <span>+91 96296 59379</span>
              </a>
              <a
                href="https://wa.me/919342764302"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1 text-emerald-400 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Quote</span>
              </a>
              <Link href="/admin/login" className="text-slate-400 hover:text-white transition">
                Staff Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Main Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
          {/* Mobile Menu Hamburger & Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-red-600 transition"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo & Wordmark */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
                🎆
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                  {language === 'ta' ? 'ரோபோ' : 'ROBO'}{' '}
                  <span className="text-red-600">{language === 'ta' ? 'பட்டாசு' : 'CRACKERS'}</span>
                </span>
                <span className="text-[10px] text-amber-600 font-bold tracking-wider uppercase">
                  Sivakasi • Estd. 1985
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-slate-100/80 focus:bg-white text-xs sm:text-sm pl-9 pr-4 py-2 rounded-full border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="lg:hidden px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-red-600" />
              <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
            </button>

            {/* Mobile search button */}
            <Link
              href="/search"
              className="md:hidden p-2 text-slate-700 hover:text-red-600 rounded-xl hover:bg-slate-100 transition"
              aria-label="Search crackers"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Quote Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="cursor-pointer relative flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-3 sm:px-4 py-2 rounded-xl shadow-xs transition-colors"
              aria-label="Open enquiry quote cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left text-xs leading-tight">
                <span className="text-[10px] text-red-200 font-medium uppercase">{t('cart')}</span>
                <span className="font-extrabold">₹{totalEstimate.toFixed(2)}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Category Nav Strip */}
        <nav className="hidden lg:block border-t border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-700">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 overflow-x-auto py-2">
            <Link href="/" prefetch={true} className="hover:text-red-600 transition whitespace-nowrap">
              Home
            </Link>
            {categories.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                prefetch={true}
                className="hover:text-red-600 transition whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/about-us" prefetch={true} className="hover:text-red-600 transition whitespace-nowrap">
              About Us
            </Link>
            <Link href="/contact-us" prefetch={true} className="hover:text-red-600 transition whitespace-nowrap">
              Contact Us
            </Link>
          </div>
        </nav>
      </header>

      {/* Slide-out Category Drawer */}
      <CategoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={categories}
      />
    </>
  );
}

