'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { PriceTag } from './PriceTag';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  Flame,
  Plus,
  Minus,
  Eye,
  X,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SpaCatalogProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    children?: Array<{ id: string; name: string; slug: string }>;
    _count?: { products: number };
  }>;
  allProducts: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    mrp: number;
    discountPct?: number | null;
    stockNote?: string | null;
    isBestSeller?: boolean;
    description?: string | null;
    categoryId: string;
    category: {
      name: string;
      slug: string;
      parent?: { name: string; slug: string } | null;
    };
    images?: Array<{ url: string; altText?: string | null }>;
    videoUrl?: string | null;
  }>;
}

export function InstantSpaCatalog({ categories, allProducts }: SpaCatalogProps) {
  const { items, addItem, updateQuantity } = useCart();

  const [selectedParentSlug, setSelectedParentSlug] = useState<string>('all');
  const [selectedSubSlug, setSelectedSubSlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('bestseller');
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Active parent category object
  const activeParent = useMemo(() => {
    return categories.find((c) => c.slug === selectedParentSlug) || null;
  }, [categories, selectedParentSlug]);

  // Instant Client-Side Filtered & Sorted Products (0ms delay)
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Filter by Parent Category
    if (selectedParentSlug !== 'all') {
      list = list.filter((p) => {
        const parentMatches = p.category.parent?.slug === selectedParentSlug;
        const directMatches = p.category.slug === selectedParentSlug;
        const subMatches = activeParent?.children?.some((c) => c.slug === p.category.slug);
        return parentMatches || directMatches || subMatches;
      });
    }

    // Filter by Subcategory
    if (selectedSubSlug !== 'all') {
      list = list.filter((p) => p.category.slug === selectedSubSlug);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    // Sort Products
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'bestseller') {
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return list;
  }, [allProducts, selectedParentSlug, selectedSubSlug, searchQuery, sortBy, activeParent]);

  const handleSelectParent = (slug: string) => {
    setSelectedParentSlug(slug);
    setSelectedSubSlug('all'); // reset subcategory filter on parent change
  };

  const getParentIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('kid')) return '🧸';
    if (n.includes('combo') || n.includes('gift')) return '🎁';
    if (n.includes('day')) return '💥';
    if (n.includes('pipe') || n.includes('shot')) return '🚀';
    if (n.includes('hand') || n.includes('sparkler')) return '✨';
    if (n.includes('night')) return '🎆';
    return '🎇';
  };

  return (
    <div className="space-y-6">
      {/* Search & Sort Controls Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Instant Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Instant search Sivakasi crackers..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results Counter & Sort */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> SKUs (80% Off)
          </span>

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-bold focus:border-red-500 outline-none cursor-pointer"
            >
              <option value="bestseller">Top Selling</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Instant Category Switcher Pills */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
          {/* "All Fireworks" Pill */}
          <button
            type="button"
            onClick={() => handleSelectParent('all')}
            className={`shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              selectedParentSlug === 'all'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-102'
                : 'bg-white hover:bg-red-50 hover:text-red-700 text-slate-700 border border-slate-200'
            }`}
          >
            <span>🎆</span>
            <span>All Fireworks ({allProducts.length})</span>
          </button>

          {/* Individual Parent Category Pills */}
          {categories.map((cat) => {
            const isSelected = selectedParentSlug === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectParent(cat.slug)}
                className={`shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-102'
                    : 'bg-white hover:bg-red-50 hover:text-red-700 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{getParentIcon(cat.name)}</span>
                <span>{cat.name}</span>
                {cat._count?.products ? (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat._count.products}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategories Filter Chips (if parent category has children) */}
      {activeParent && activeParent.children && activeParent.children.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pl-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pr-1">
            Types:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSubSlug('all')}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
              selectedSubSlug === 'all'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All {activeParent.name}
          </button>

          {activeParent.children.map((sub) => {
            const isSubSelected = selectedSubSlug === sub.slug;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubSlug(sub.slug)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  isSubSelected
                    ? 'bg-amber-500 text-white font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Instant Filtered Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-base font-bold text-slate-800">No Fireworks Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No products matched your active category or search filter. Try resetting your search or selecting &quot;All Fireworks&quot;.
          </p>
          <button
            onClick={() => {
              setSelectedParentSlug('all');
              setSelectedSubSlug('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs hover:bg-red-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((prod) => {
            const priceNum = Number(prod.price);
            const mrpNum = Number(prod.mrp);
            const cartItem = items.find((i) => i.productId === prod.id);
            const qty = cartItem ? cartItem.quantity : 0;
            const hasUploadedImage = prod.images && prod.images.length > 0;

            return (
              <div
                key={prod.id}
                className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-red-200 transition-all duration-200 overflow-hidden"
              >
                {/* 80% Off Badge */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs">
                    80% OFF
                  </span>
                </div>

                {/* Best Seller Badge */}
                {prod.isBestSeller && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                      <Flame className="w-3 h-3 fill-white" />
                      Best Seller
                    </span>
                  </div>
                )}

                {/* Product Image Container */}
                <div
                  onClick={() => setQuickViewProduct(prod)}
                  className="block relative aspect-4/3 w-full bg-gradient-to-br from-slate-900 via-zinc-800 to-amber-950 overflow-hidden cursor-pointer"
                >
                  {hasUploadedImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={prod.images![0].url}
                      alt={prod.images![0].altText || prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-zinc-300 select-none">
                      <Sparkles className="w-6 h-6 text-amber-400 mb-1 animate-pulse" />
                      <span className="text-[11px] font-bold text-white leading-tight line-clamp-1">
                        {prod.name}
                      </span>
                      <span className="text-[9px] text-amber-300/90 font-mono mt-0.5">
                        Genuine Sivakasi Batch
                      </span>
                    </div>
                  )}

                  {/* Quick View Hover Pill */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-red-600" />
                      <span>Quick View</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-red-600 truncate">
                        {prod.category.name}
                      </span>
                      {prod.stockNote && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium shrink-0">
                          {prod.stockNote}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/product/${prod.slug}`}
                      prefetch={true}
                      className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition line-clamp-1"
                    >
                      {prod.name}
                    </Link>
                  </div>

                  {/* Pricing and Add to Quote Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
                    <PriceTag
                      price={priceNum}
                      mrp={mrpNum}
                      discountPct={prod.discountPct ?? 80}
                      size="sm"
                    />

                    {qty > 0 ? (
                      <div className="flex items-center gap-1 bg-red-600 text-white rounded-xl p-1 shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(prod.id, qty - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-red-700 rounded-lg transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-black text-xs px-1 min-w-4 text-center">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(prod.id, qty + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-red-700 rounded-lg transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          addItem({
                            productId: prod.id,
                            name: prod.name,
                            slug: prod.slug,
                            price: priceNum,
                            mrp: mrpNum,
                            discountPct: prod.discountPct ?? 80,
                            categoryName: prod.category?.name,
                            stockNote: prod.stockNote,
                          })
                        }
                        className="cursor-pointer inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Quote</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instant Quick-View Slide-Over Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto p-6 space-y-5">
                {/* Product Photo or Placeholder */}
                <div className="relative aspect-16/9 w-full rounded-2xl bg-gradient-to-br from-slate-900 via-zinc-800 to-amber-950 overflow-hidden flex items-center justify-center text-center">
                  {quickViewProduct.images && quickViewProduct.images.length > 0 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={quickViewProduct.images[0].url}
                      alt={quickViewProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-6 text-white space-y-2">
                      <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                      <h4 className="text-base font-bold">{quickViewProduct.name}</h4>
                      <span className="text-xs text-amber-300 font-mono">
                        Genuine Sivakasi Batch
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                      80% OFF MRP
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    {quickViewProduct.category.name}
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    {quickViewProduct.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {quickViewProduct.description ||
                      'Genuine Sivakasi fireworks direct from manufacturer with CSIR-NEERI green cracker standard.'}
                  </p>
                </div>

                {/* Pricing Box */}
                <div className="p-4 bg-red-50/60 rounded-2xl border border-red-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">
                      Wholesale Quote Rate
                    </span>
                    <PriceTag
                      price={Number(quickViewProduct.price)}
                      mrp={Number(quickViewProduct.mrp)}
                      discountPct={quickViewProduct.discountPct ?? 80}
                      size="lg"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
                      Save ₹{(Number(quickViewProduct.mrp) - Number(quickViewProduct.price)).toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      addItem({
                        productId: quickViewProduct.id,
                        name: quickViewProduct.name,
                        slug: quickViewProduct.slug,
                        price: Number(quickViewProduct.price),
                        mrp: Number(quickViewProduct.mrp),
                        discountPct: quickViewProduct.discountPct ?? 80,
                        categoryName: quickViewProduct.category?.name,
                        stockNote: quickViewProduct.stockNote,
                      });
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Enquiry Quote Cart</span>
                  </button>

                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/product/${quickViewProduct.slug}`}
                      prefetch={true}
                      onClick={() => setQuickViewProduct(null)}
                      className="flex-1 py-2.5 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                    >
                      View Full Details & Specs →
                    </Link>
                    <a
                      href={`https://wa.me/919629659379?text=${encodeURIComponent(
                        `Hello Robo Crackers, enquiring about "${quickViewProduct.name}" (Quote ₹${Number(
                          quickViewProduct.price
                        ).toFixed(2)})`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
