'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { PriceTag } from './PriceTag';
import { Sparkles, Plus, Minus, Flame, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: any;
    mrp: any;
    discountPct?: number | null;
    stockNote?: string | null;
    isBestSeller?: boolean;
    category?: {
      name: string;
      slug: string;
    };
    images?: { url: string; altText?: string | null }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const priceNum = Number(product.price);
  const mrpNum = Number(product.mrp);

  const cartItem = items.find((i) => i.productId === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: priceNum,
      mrp: mrpNum,
      discountPct: product.discountPct ?? 80,
      categoryName: product.category?.name,
      stockNote: product.stockNote,
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, qtyInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, qtyInCart - 1);
  };

  // Select appropriate festive cracker icon based on product name or category
  const nameLower = product.name.toLowerCase();
  const getCrackerTypeLabel = () => {
    if (nameLower.includes('sparkler')) return 'Sparklers';
    if (nameLower.includes('wheel') || nameLower.includes('chakkar')) return 'Ground Spinner';
    if (nameLower.includes('rocket')) return 'Sky Rocket';
    if (nameLower.includes('shot') || nameLower.includes('pipe') || nameLower.includes('cake')) return 'Aerial Shots';
    if (nameLower.includes('bijili') || nameLower.includes('sound') || nameLower.includes('bomb') || nameLower.includes('kuruvi')) return 'Sound Cracker';
    if (nameLower.includes('pot')) return 'Flower Pot';
    return 'Festive Cracker';
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-red-200 transition-all duration-200 overflow-hidden">
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.isBestSeller && (
          <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
            <Flame className="w-3 h-3 fill-white" />
            Best Seller
          </span>
        )}
      </div>

      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs">
          80% OFF
        </span>
      </div>

      {/* Honest Genuine Sivakasi Placeholder / Real Photo Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-4/3 w-full bg-gradient-to-br from-slate-900 via-zinc-800 to-amber-950 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.images[0].url}
            alt={product.images[0].altText || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none">
            {/* Animated Festive Glow */}
            <div className="relative mb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-red-500/20 border border-amber-400/30 flex items-center justify-center shadow-inner">
                <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>
            </div>

            <span className="text-[11px] font-bold tracking-wider text-amber-300 uppercase">
              {getCrackerTypeLabel()}
            </span>

            {/* Genuine Sivakasi Batch Badge */}
            <div className="mt-1 inline-flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-zinc-200 border border-white/15">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Genuine Sivakasi Batch</span>
            </div>

            <span className="text-[9px] text-zinc-400 mt-1 font-mono">
              Photo update in progress
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {product.category && (
            <span className="text-[11px] font-medium text-slate-500 tracking-wide block mb-1">
              {product.category.name}
            </span>
          )}

          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.stockNote && (
            <p className="mt-1 text-[11px] text-amber-700 font-medium">
              ⚡ {product.stockNote}
            </p>
          )}
        </div>

        {/* Pricing & Add to Quote Cart Button */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <PriceTag price={priceNum} mrp={mrpNum} discountPct={product.discountPct} size="md" />

          <div>
            {qtyInCart === 0 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="cursor-pointer inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-xs transition-colors"
                title="Add to Enquiry Quote"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 p-1 rounded-xl">
                <button
                  onClick={handleDecrement}
                  className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg bg-white text-red-600 hover:bg-red-100 font-bold transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-black text-red-700">
                  {qtyInCart}
                </span>
                <button
                  onClick={handleIncrement}
                  className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 font-bold transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
