import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Search } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Search Results for "${q}" — Robo Crackers` : 'Search Fireworks — Robo Crackers',
    description: `Search Sivakasi crackers and fireworks wholesale catalog at 80% off MRP.`,
  };
}

import { searchCatalog } from '@/lib/catalog-service';

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  let products: any[] = [];
  if (query) {
    products = await searchCatalog(query);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Search Fireworks Catalog
        </h1>
        <form action="/search" method="GET" className="relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by cracker name, sparklers, rockets, gift boxes..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-24 py-3 text-sm focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
          >
            Search
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
          <span>Popular searches:</span>
          {['Sparklers', 'Chakkar', 'Rockets', 'Lakshmi', 'Win Wheel', 'Gift Box'].map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="bg-slate-100 hover:bg-red-50 hover:text-red-600 px-2.5 py-1 rounded-full text-[11px] font-medium transition"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {query ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-800">
              Results for &quot;<span className="text-red-600">{query}</span>&quot; ({products.length} found)
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="text-lg font-bold text-slate-800">No Fireworks Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn&apos;t find any crackers matching &quot;{query}&quot;. Try searching for &quot;Sparklers&quot;, &quot;Chakkar&quot;, or browse our categories.
              </p>
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
              >
                Back to All Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
