'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddToCartDetailButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    mrp: number;
    discountPct: number;
    categoryName?: string;
    stockNote?: string | null;
  };
}

export function AddToCartDetailButton({ product }: AddToCartDetailButtonProps) {
  const { addItem } = useCart();
  const [selectedQty, setSelectedQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        mrp: product.mrp,
        discountPct: product.discountPct,
        categoryName: product.categoryName,
        stockNote: product.stockNote,
      },
      selectedQty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between border-2 border-slate-200 rounded-xl bg-slate-50 p-1 w-full sm:w-36 shrink-0">
        <button
          onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
          className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-red-50 hover:text-red-600 font-bold transition cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-black text-sm text-slate-900 px-3">
          {selectedQty}
        </span>
        <button
          onClick={() => setSelectedQty((q) => q + 1)}
          className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-red-50 hover:text-red-600 font-bold transition cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Main Add Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAdd}
        className={`cursor-pointer flex-1 py-3 px-6 rounded-xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition duration-200 ${
          justAdded
            ? 'bg-emerald-600 text-white'
            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
        }`}
      >
        {justAdded ? (
          <>
            <Check className="w-5 h-5 animate-bounce" />
            <span>Added to Quote Cart!</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            <span>Add {selectedQty > 1 ? `(${selectedQty})` : ''} to Quote Cart</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
