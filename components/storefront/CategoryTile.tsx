import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  Gift,
  Sun,
  Moon,
  Zap,
  Package,
  Layers,
} from 'lucide-react';

interface CategoryTileProps {
  name: string;
  slug: string;
  productCount?: number;
  subcategoriesCount?: number;
}

export function CategoryTile({ name, slug, productCount, subcategoriesCount }: CategoryTileProps) {
  // Map appropriate festive icon and gradient per category
  const getCategoryTheme = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('kid')) {
      return {
        icon: <Sparkles className="w-6 h-6 text-amber-500" />,
        bg: 'from-amber-500/10 to-orange-500/10 border-amber-200',
        badge: 'text-amber-700 bg-amber-100',
      };
    }
    if (lower.includes('combo')) {
      return {
        icon: <Package className="w-6 h-6 text-rose-500" />,
        bg: 'from-rose-500/10 to-red-500/10 border-rose-200',
        badge: 'text-rose-700 bg-rose-100',
      };
    }
    if (lower.includes('day')) {
      return {
        icon: <Sun className="w-6 h-6 text-yellow-500" />,
        bg: 'from-yellow-500/10 to-amber-500/10 border-yellow-200',
        badge: 'text-yellow-800 bg-yellow-100',
      };
    }
    if (lower.includes('pipe')) {
      return {
        icon: <Zap className="w-6 h-6 text-indigo-500" />,
        bg: 'from-indigo-500/10 to-purple-500/10 border-indigo-200',
        badge: 'text-indigo-700 bg-indigo-100',
      };
    }
    if (lower.includes('gift')) {
      return {
        icon: <Gift className="w-6 h-6 text-red-500" />,
        bg: 'from-red-500/10 to-rose-500/10 border-red-200',
        badge: 'text-red-700 bg-red-100',
      };
    }
    if (lower.includes('hand') || lower.includes('sparkler')) {
      return {
        icon: <Flame className="w-6 h-6 text-emerald-500" />,
        bg: 'from-emerald-500/10 to-teal-500/10 border-emerald-200',
        badge: 'text-emerald-700 bg-emerald-100',
      };
    }
    if (lower.includes('night cracker')) {
      return {
        icon: <Moon className="w-6 h-6 text-purple-500" />,
        bg: 'from-purple-500/10 to-fuchsia-500/10 border-purple-200',
        badge: 'text-purple-700 bg-purple-100',
      };
    }
    // Night shots cakes / default
    return {
      icon: <Layers className="w-6 h-6 text-orange-500" />,
      bg: 'from-orange-500/10 to-red-500/10 border-orange-200',
      badge: 'text-orange-700 bg-orange-100',
    };
  };

  const theme = getCategoryTheme(name);

  return (
    <Link
      href={`/category/${slug}`}
      prefetch={true}
      className={`group relative flex flex-col items-center text-center p-4 rounded-2xl bg-gradient-to-b ${theme.bg} border hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
    >
      <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
        {theme.icon}
      </div>

      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
        {name}
      </h3>

      {subcategoriesCount !== undefined && subcategoriesCount > 0 ? (
        <span className="text-[10px] text-slate-500 mt-0.5">
          {subcategoriesCount} Sub-types
        </span>
      ) : productCount !== undefined ? (
        <span className="text-[10px] text-slate-500 mt-0.5">
          {productCount} Products
        </span>
      ) : (
        <span className="text-[10px] text-slate-500 mt-0.5">
          Wholesale Sivakasi
        </span>
      )}
    </Link>
  );
}
