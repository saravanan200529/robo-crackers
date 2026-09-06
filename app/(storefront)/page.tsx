import React from 'react';
import Link from 'next/link';
import { CategoryTile } from '@/components/storefront/CategoryTile';
import { Sparkles, ShieldCheck, Flame, MessageCircle, ArrowRight, Award, CheckCircle } from 'lucide-react';

import { getCatalogCategories, getAllCatalogProducts } from '@/lib/catalog-service';
import { InstantSpaCatalog } from '@/components/storefront/InstantSpaCatalog';

export const revalidate = 60; // Incremental Static Regeneration (ISR) every 60s

export default async function HomePage() {
  const [categories, allProducts] = await Promise.all([
    getCatalogCategories(),
    getAllCatalogProducts(),
  ]);

  return (
    <div className="space-y-8 sm:space-y-12 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-amber-950 text-white py-10 sm:py-16 px-4 sm:px-6 shadow-md">
        {/* Decorative background glow circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4 text-center md:text-left">
            {/* Festival Pill */}
            <div className="inline-flex items-center gap-2 bg-amber-400/20 backdrop-blur-md border border-amber-400/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Diwali 2026 Festival Booking Open • Flat 80% Off MRP</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Genuine Sivakasi Fireworks Direct From Manufacturer
            </h1>

            <p className="text-sm sm:text-base text-red-100/90 leading-relaxed">
              Operating since 1985 in Sivakasi. Premium quality eco-friendly green crackers, gift boxes, aerial shots, and ground chakkars at authentic direct wholesale prices.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                CSIR-NEERI Green Crackers
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Zero Online Transaction Risks
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Wholesale Quote via WhatsApp
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-3">
              <Link
                href="/category/day-crackers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm px-6 py-3 rounded-xl shadow-lg transition transform active:scale-95"
              >
                <span>Browse Fireworks Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919342764302?text=Hello%20Robo%20Crackers,%20I%20want%20to%20know%20more%20about%20your%20festival%20price%20list"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-5 py-3 rounded-xl border border-white/20 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Instant WhatsApp Quote</span>
              </a>
            </div>
          </div>

          {/* Hero Promo Box */}
          <div className="w-full sm:w-80 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl text-center flex flex-col items-center">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Wholesale Advantage
            </span>
            <div className="text-5xl font-black text-white mt-1 tracking-tight">
              80<span className="text-amber-400">%</span>
            </div>
            <span className="text-xs text-red-100 font-semibold uppercase">
              Flat Discount on All SKUs
            </span>
            <div className="w-full border-t border-white/15 my-3" />
            <p className="text-[11px] text-red-100/80 leading-snug">
              Direct from Sivakasi ROBO Agencies factories. Minimum booking cart applies for offline delivery.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-black/30 px-3 py-1.5 rounded-full">
              <Award className="w-4 h-4" />
              <span>38+ Years of Sivakasi Trust</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🎆 Explore Categories</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse by sound, color, sparklers, rockets, and gift boxes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <CategoryTile
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              productCount={cat._count?.products}
              subcategoriesCount={cat.children?.length}
            />
          ))}
        </div>
      </section>

      {/* Instant SPA Fireworks Catalog (Zero-Lag Client-Side Browsing) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span>Interactive Instant Catalog</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Explore Fireworks Collection (80% Off MRP)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Switch between categories, sound types, and sparklers instantly with zero page reloads
          </p>
        </div>

        <InstantSpaCatalog categories={categories} allProducts={allProducts} />
      </section>

      {/* 3 Step Simple Enquiry Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-800">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              Supreme Court Compliant
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              How the Enquiry Quote Model Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Order fireworks safely without illegal online card transactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center font-black text-lg mb-3">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-1">Add to Quote Cart</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your favorite Sivakasi crackers with full wholesale 80% discount applied to your quote.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-amber-600/30 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-lg mb-3">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-1">Submit Contact Details</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your WhatsApp number and delivery location. No payment is requested or collected online.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-lg mb-3">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-1">WhatsApp Confirmation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One-tap connects you with our Sivakasi staff to confirm stock, dispatch schedule, and close the order offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Heritage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Since 1985 Heritage</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                38+ continuous years supplying genuine fireworks from Sivakasi.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Green Crackers Only</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Compliant with CSIR-NEERI standards with reduced emissions.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Supreme Court Compliant</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Enquiry model ensuring 100% legal compliance.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">24-Hour WhatsApp Reply</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick quote confirmation and dispatch tracking.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
