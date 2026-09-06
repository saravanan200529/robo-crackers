'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeItem,
    totalCount,
    totalEstimate,
    totalMrp,
    totalSavings,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5" />
                <div>
                  <h2 className="text-base font-bold">Your Enquiry Quote Cart</h2>
                  <p className="text-xs text-red-100">{totalCount} items selected</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="cursor-pointer p-1.5 rounded-full hover:bg-white/20 transition text-white"
                aria-label="Close quote drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Supreme Court Note */}
            <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex items-center gap-2 text-amber-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Enquiry Quote only. Payment & order closed offline via WhatsApp.</span>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Your Quote is Empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Browse our Sivakasi fireworks catalog and add products to estimate your wholesale festival quote.
                  </p>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <div key={item.productId} className="py-3 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xs font-bold text-red-600">
                            ₹{item.price.toFixed(2)}
                          </span>
                          {item.mrp > item.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{item.mrp.toFixed(2)}
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {item.discountPct}% OFF
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2.5">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-red-600 transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-red-600 transition"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-slate-400 hover:text-red-500 p-1 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-slate-900">
                          ₹{lineTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {items.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Original MRP Total:</span>
                    <span className="line-through text-slate-400">₹{totalMrp.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Festival Savings (80% Off):
                    </span>
                    <span>-₹{totalSavings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-200">
                    <span>Estimated Quote:</span>
                    <span className="text-red-600">₹{totalEstimate.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                >
                  <span>Review Quote & Submit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
