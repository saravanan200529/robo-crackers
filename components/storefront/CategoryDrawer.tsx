'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ChevronRight, Sparkles, Phone, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  children?: { id: string; name: string; slug: string }[];
}

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
}

export function CategoryDrawer({ isOpen, onClose, categories }: CategoryDrawerProps) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-screen max-w-xs bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="font-extrabold text-base tracking-wide">Browse Categories</span>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer p-1.5 rounded-full hover:bg-white/20 transition text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category list */}
            <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100">
              {categories.map((cat) => {
                const hasChildren = cat.children && cat.children.length > 0;
                const isExpanded = expandedCat === cat.id;

                return (
                  <div key={cat.id} className="py-1.5">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/category/${cat.slug}`}
                        prefetch={true}
                        onClick={onClose}
                        className="flex-1 py-2 text-sm font-bold text-slate-800 hover:text-red-600 transition"
                      >
                        {cat.name}
                      </Link>

                      {hasChildren && (
                        <button
                          onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition"
                        >
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-red-600' : ''
                              }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Subcategories */}
                    {hasChildren && isExpanded && (
                      <div className="pl-3 pb-2 pt-1 flex flex-col gap-1 border-l-2 border-red-200 ml-2">
                        {cat.children!.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${sub.slug}`}
                            prefetch={true}
                            onClick={onClose}
                            className="py-1 text-xs font-medium text-slate-600 hover:text-red-600 transition"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick contact footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2 text-xs">
              <span className="font-bold text-slate-700">Need Immediate Assistance?</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/919629659379"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+916369401248"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
