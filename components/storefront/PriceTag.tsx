import React from 'react';

interface PriceTagProps {
  price: number;
  mrp: number;
  discountPct?: number | null;
  size?: 'sm' | 'md' | 'lg';
  showSavings?: boolean;
}

export function PriceTag({ price, mrp, discountPct, size = 'md', showSavings = false }: PriceTagProps) {
  const savings = Math.max(0, mrp - price);
  const discount = discountPct ?? Math.round((savings / mrp) * 100);

  const priceSizes = {
    sm: 'text-sm font-bold',
    md: 'text-lg font-bold sm:text-xl',
    lg: 'text-2xl font-extrabold sm:text-3xl',
  };

  const mrpSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`text-red-600 tracking-tight ${priceSizes[size]}`}>
          ₹{price.toFixed(2)}
        </span>
        {mrp > price && (
          <span className={`text-slate-400 line-through font-normal ${mrpSizes[size]}`}>
            ₹{mrp.toFixed(2)}
          </span>
        )}
        {discount > 0 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 tracking-tight">
            {discount}% OFF
          </span>
        )}
      </div>

      {showSavings && savings > 0 && (
        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
          🎉 You save ₹{savings.toFixed(2)}
        </span>
      )}
    </div>
  );
}
