import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Sparkles, ChevronRight, SlidersHorizontal } from 'lucide-react';

import { getCategoryBySlug, getCategoryProducts } from '@/lib/catalog-service';

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
  searchParams: Promise<{
    sub?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  try {
    const { categorySlug } = await params;
    const category = await getCategoryBySlug(categorySlug);

    if (!category) return { title: 'Fireworks Category — Robo Crackers' };

    return {
      title: `${category.name} Fireworks Wholesale (80% Off) — Robo Crackers Sivakasi`,
      description: `Browse Sivakasi ${category.name} fireworks at factory wholesale prices. Add to enquiry quote with 80% discount. Genuine batch quality.`,
    };
  } catch {
    return { title: 'Fireworks Category — Robo Crackers' };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categorySlug } = await params;
  const { sub, sort } = await searchParams;

  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const products = await getCategoryProducts(categorySlug, sub, sort);

  const activeSubcategory = sub && category.children
    ? category.children.find((c: any) => c.slug === sub)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-red-600 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {category.parent && (
          <>
            <Link
              href={`/category/${category.parent.slug}`}
              className="hover:text-red-600 transition"
            >
              {category.parent.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </>
        )}
        <span className="font-bold text-slate-800">
          {activeSubcategory ? activeSubcategory.name : category.name}
        </span>
      </nav>

      {/* Category Header Banner */}
      <div className="bg-gradient-to-r from-red-700 to-amber-700 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-amber-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wholesale Sivakasi Fireworks • Flat 80% Off</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {activeSubcategory ? activeSubcategory.name : category.name}
          </h1>
          <p className="text-xs sm:text-sm text-red-100/90 mt-1 max-w-xl">
            Select products and add to your quote cart. All orders are confirmed offline via WhatsApp as per 2018 Supreme Court order.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center shrink-0">
          <span className="block text-2xl font-black">{products.length}</span>
          <span className="text-[11px] text-amber-200 uppercase font-bold tracking-wider">
            Crackers Available
          </span>
        </div>
      </div>

      {/* Subcategory Chips Filter */}
      {category.children.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            Filter by Sub-Type:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href={`/category/${category.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                !sub
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300'
              }`}
            >
              All {category.name} ({products.length})
            </Link>

            {category.children.map((child: any) => (
              <Link
                key={child.id}
                href={`/category/${category.slug}?sub=${child.slug}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  sub === child.slug
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300'
                }`}
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sort Bar */}
      <div className="flex items-center justify-between gap-4 py-2 border-y border-slate-200 text-xs">
        <span className="font-semibold text-slate-600">
          Showing {products.length} crackers
        </span>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 hidden sm:inline">Sort:</span>
          <div className="flex items-center gap-1">
            <Link
              href={`/category/${category.slug}${sub ? `?sub=${sub}&` : '?'}sort=bestseller`}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                sort === 'bestseller'
                  ? 'bg-red-100 text-red-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Popular
            </Link>
            <Link
              href={`/category/${category.slug}${sub ? `?sub=${sub}&` : '?'}sort=price_asc`}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                sort === 'price_asc'
                  ? 'bg-red-100 text-red-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Price: Low to High
            </Link>
            <Link
              href={`/category/${category.slug}${sub ? `?sub=${sub}&` : '?'}sort=price_desc`}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                sort === 'price_desc'
                  ? 'bg-red-100 text-red-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Price: High to Low
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <span className="text-4xl">🎆</span>
          <h3 className="text-lg font-bold text-slate-800">No Crackers in this Subcategory</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Check back soon or explore other Sivakasi categories for available festival stock.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
          >
            Return to Homepage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
