import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { STATIC_PRODUCTS } from '@/lib/catalog-data';
import {
  FileText,
  Clock,
  Package,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  Download,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let totalEnquiries = 0;
  let pendingEnquiries = 0;
  let totalEstimateSum = 0;
  let productsCount = 0;
  let recentEnquiries: any[] = [];

  try {
    const [enqCount, pendingCount, sumResult, prodCount, recents] = await Promise.all([
      db.enquiry.count(),
      db.enquiry.count({ where: { status: 'PENDING' } }),
      db.enquiry.aggregate({ _sum: { totalEstimate: true } }),
      db.product.count({ where: { isActive: true } }),
      db.enquiry.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          items: { include: { product: { select: { name: true } } } },
        },
      }),
    ]);

    totalEnquiries = enqCount;
    pendingEnquiries = pendingCount;
    totalEstimateSum = Number(sumResult._sum.totalEstimate || 0);
    productsCount = prodCount;
    recentEnquiries = recents;
  } catch (e) {
    console.warn('Dashboard DB load warning:', e);
    productsCount = STATIC_PRODUCTS.length;
  }

  if (productsCount === 0) {
    productsCount = STATIC_PRODUCTS.length;
  }

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Diwali season fireworks quote volume & customer follow-ups
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/admin/export/customers"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-red-600 hover:border-red-200 text-xs font-bold shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Customers (.xlsx)</span>
          </a>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition"
          >
            <span>+ Add New Cracker</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Total Enquiries
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {totalEnquiries}
            </div>
            <span className="text-[11px] text-slate-400">All-time quote submissions</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider">
              Pending Follow-Up
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {pendingEnquiries}
            </div>
            <span className="text-[11px] text-amber-600 font-medium">Needs WhatsApp/Call</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Total Est. Quote Value
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₹{totalEstimateSum.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">80% wholesale quotes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Catalog Products
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {productsCount}
            </div>
            <span className="text-[11px] text-slate-400">Across 40 subcategories</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Customer Enquiries</h2>
            <p className="text-xs text-slate-500">Live incoming festival quote requests</p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>View All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No customer enquiries logged yet. Once visitors submit the quote cart, they will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Quote Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone / City</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Total Quote</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentEnquiries.map((enq) => {
                  const quoteRef = `ROBO-${enq.id.slice(-6).toUpperCase()}`;
                  const itemsText = enq.items
                    .map((i: any) => `${i.product.name} (x${i.quantity})`)
                    .join(', ');

                  return (
                    <tr key={enq.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {quoteRef}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {enq.customer.name}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono">{enq.customer.phone}</div>
                        <div className="text-[10px] text-slate-400">{enq.customer.city || 'Tamil Nadu'}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate" title={itemsText}>
                        {itemsText}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900">
                        ₹{Number(enq.totalEstimate).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            enq.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : enq.status === 'CONTACTED'
                              ? 'bg-blue-100 text-blue-800'
                              : enq.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`https://wa.me/91${enq.customer.phone}?text=Hello%20${encodeURIComponent(
                            enq.customer.name
                          )},%20we%20received%20your%20Robo%20Crackers%20Quote%20${quoteRef}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg transition"
                          title="Chat with customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
