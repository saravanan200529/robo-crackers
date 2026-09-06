import React from 'react';
import { db } from '@/lib/db';
import { Calendar, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDiscountsPage() {
  let discounts: any[] = [];
  try {
    discounts = await db.discount.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.warn('DB not connected on AdminDiscountsPage:', e);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Festive Discounts & Campaigns
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage storewide Diwali discount percentages applied to catalog MRP ({discounts.length} campaigns)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discounts.map((disc) => (
          <div
            key={disc.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl">
                  {disc.percentage}%
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{disc.name}</h3>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Storewide Active Campaign
                  </span>
                </div>
              </div>

              <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Campaign Validity:</span>
              </div>
              <span className="font-mono font-medium">
                {disc.startsAt ? new Date(disc.startsAt).toISOString().split('T')[0] : '2026-08-01'} to{' '}
                {disc.endsAt ? new Date(disc.endsAt).toISOString().split('T')[0] : '2026-11-30'}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Applied automatically across all categories. Produces crossed-out MRP and discounted wholesale quote price on all storefront cards.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
